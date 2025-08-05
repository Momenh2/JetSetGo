import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  TextField,
  Box,
  CircularProgress,
  IconButton,
  Divider,
} from "@mui/material";
import RadioGroupRating from "./RadioGroupRating"; // Assuming this is your custom rating component
import "./AddRatingComment.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // You can use Material-UI's back arrow icon
import { useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie

function AddRatingCommentItinerary() {
  const token = Cookies.get("auth_token");
  const decodedToken = jwtDecode(token);
  const id = decodedToken.id;
  console.log("id:", id);
  const modelName = decodedToken.userType;
  console.log("modelName:", modelName);
  const location = useLocation(); // Access the location object
  // const { id } = location.state || {}; // Access the id from state
  const { iternaryId } = useParams();
  console.log(id, iternaryId)
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState(null);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [hasRated, setHasRated] = useState(false);
  const touristId = id; // Replace with the actual tourist ID

  useEffect(() => {
    // Fetch the itinerary details by itineraryId
    fetch(`http://localhost:8000/api/tourist/getSingleItinerary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itineraryId: iternaryId }), // Send itineraryId to the backend
    })
      .then((res) => res.json())
      .then((data) => {
        setItinerary(data);
        if (
          data.ratings &&
          data.ratings.some((rating) => rating.tourist === touristId)
        ) {
          setHasRated(true);
        } else {
          setHasRated(false);
        }
      })
      .catch((error) =>
        console.error("Error fetching itinerary details:", error)
      );
  }, [iternaryId, touristId]);

  const handleRatingSubmit = () => {
    if (hasRated || !newRating) return;
    const ratingData = {
      touristId,
      itineraryId: iternaryId,
      rating: newRating,
    };

    fetch(`http://localhost:8000/api/tourist/addItineraryRating`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ratingData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error("Error submitting rating:", data.error);
        } else {
          setItinerary((prev) => ({
            ...prev,
            ratings: [...(prev?.ratings || []), data],
          }));
          setNewRating(0);
          setHasRated(true);
          alert("Rating submitted successfully!"); // Alert on success

        }
      })
      .catch((error) => console.error("Error submitting rating:", error));
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    const commentData = {
      touristId,
      itineraryId: iternaryId,
      comment: newComment,
    };

    fetch(`http://localhost:8000/api/tourist/addItineraryComment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(commentData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setNewComment("");
          alert("Comment submitted successfully!"); // Alert on success
          navigate(-1); // Redirect back after success
        } else {
          console.error("Error submitting comment:", data.error);
        }
      })
      .catch((error) => console.error("Error submitting comment:", error));
  };

  return itinerary ? (
    <Box sx={{ padding: 3 }}>
      {/* Back Button */}
      <IconButton onClick={() => navigate(-1)} color="primary" sx={{ mb: 2 }}>
        <ArrowBackIcon /> {/* Back arrow icon */}
      </IconButton>
      <Divider sx={{ my: 3 }} />

      <Box sx={{ my: 3 }}>
        <Typography variant="h6">Add a Rating</Typography>
        <RadioGroupRating
          value={newRating}
          onChange={(e, newValue) => setNewRating(newValue)}
          disabled={hasRated}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleRatingSubmit}
          disabled={hasRated}
          sx={{ mt: 1 }}
        >
          {hasRated ? "Rating Submitted" : "Submit Rating"}
        </Button>
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography variant="h6">Add a Comment</Typography>
        <TextField
          fullWidth
          multiline
          rows={2} // Adjusted for more space
          variant="outlined"
          value={newComment}
          onChange={(e) => {
            if (e.target.value.length <= 250) {
              setNewComment(e.target.value);
            }
          }}
          placeholder="Leave a comment (max 250 characters)"
          sx={{ my: 1 }}
        />
        <Typography variant="body2" color="textSecondary">
          {250 - newComment.length} characters remaining
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCommentSubmit}
          sx={{ mt: 1 }}
        >
          Submit Comment
        </Button>
      </Box>
    </Box>
  ) : (
    <CircularProgress />
  );
}

export default AddRatingCommentItinerary;
