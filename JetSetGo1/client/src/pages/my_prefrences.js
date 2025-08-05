import React, { useState, useEffect } from 'react';
import {jwtDecode} from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie
import axios from 'axios';
import styled from 'styled-components'; // Import styled-components

const MyPrefs = () => {
  const [preferences, setPreferences] = useState(null);
  const [tagNames, setTagNames] = useState([]); // State for tag names
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = Cookies.get("auth_token");
  const decodedToken = jwtDecode(token);
  const id = decodedToken.id;

  // Fetch preferences for the specified user ID
  const fetchPreferences = async () => {
    try {
      console.log("Fetching preferences");
      const response = await axios.get(`/api/tourist/myPrefrences/${id}`);
      const preferencesData = response.data;

      setPreferences(preferencesData);

      // Extract IDs and fetch tag names
      if (preferencesData?.tags?.length > 0) {
        const tagIds = preferencesData.tags;
        await fetchTagNames(tagIds); // Fetch tag names using the tag IDs
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      setError('Error fetching preferences');
    }
  };

  // Fetch tag names for the specified IDs
  const fetchTagNames = async (tagIds) => {
    try {
      console.log("Fetching tag names");
      const responses = await Promise.all(
        tagIds.map((tagId) => axios.get(`/api/tourist/tagName/${tagId}`))
      );
      const fetchedTagNames = responses
        .filter((response) => response.status === 200)
        .map((response) => response.data.tag_name); // Extract `tag_name`
      setTagNames(fetchedTagNames);
    } catch (error) {
      console.error('Error fetching tag names:', error);
      setError('Error fetching tag names');
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPreferences().finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {preferences ? (
        <div>
          <Title>Selected Tags:</Title>
          <TagContainer>
            {tagNames.map((tagName, index) => (
              <TagItem key={index}>{tagName}</TagItem>
            ))}
          </TagContainer>
          <Title>Budget:</Title>
          <BudgetContainer>
            <BudgetItem>
              <BudgetLabel>Lower Limit:</BudgetLabel>
              <BudgetValue>{preferences.budget?.from || 'N/A'}</BudgetValue>
            </BudgetItem>
            <BudgetItem>
              <BudgetLabel>Upper Limit:</BudgetLabel>
              <BudgetValue>{preferences.budget?.to || 'N/A'}</BudgetValue>
            </BudgetItem>
          </BudgetContainer>
        </div>
      ) : (
        <p>No preferences found for this user.</p>
      )}
    </div>
  );
};

const Title = styled.h3`
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const TagItem = styled.span`
  background-color: #e0f7fa;
  color: #00796b;
  padding: 10px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  display: inline-block;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const BudgetContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const BudgetItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  background-color: #fff3e0;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const BudgetLabel = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: #ff6f00;
`;

const BudgetValue = styled.span`
  font-size: 16px;
  color: #333;
`;

export default MyPrefs;