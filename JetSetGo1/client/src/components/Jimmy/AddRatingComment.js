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
  Alert,
} from "@mui/material";
import RadioGroupRating from "./RadioGroupRating"; // Assuming this is your custom rating component
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // You can use Material-UI's back arrow icon
import "./AddRatingComment.css";
import { useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie

function AddRatingComment() {
  const { guideId } = useParams();
  const token = Cookies.get("auth_token");
  const decodedToken = jwtDecode(token);
  const id = decodedToken.id;
  console.log("id:", id);
  const modelName = decodedToken.userType;
  console.log("modelName:", modelName);
  const location = useLocation(); // Access the location object
  // const { id } = location.state || {}; // Access the id from state
  const navigate = useNavigate();
  const [tourGuide, setTourGuide] = useState(null);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [hasRated, setHasRated] = useState(false);
  const [ratingError, setRatingError] = useState("");
  const [commentError, setCommentError] = useState("");
  const [ratingSuccess, setRatingSuccess] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);
  const touristId = id;

  useEffect(() => {
    fetch(`http://localhost:8000/api/tour-guides/profile/${guideId}`)
      .then((res) => res.json())
      .then((data) => {
        setTourGuide(data);
        if (
          data.ratings &&
          data.ratings.some((rating) => rating.tourist._id === touristId)
        ) {
          setHasRated(true);
        } else {
          setHasRated(false);
        }
      })
      .catch((error) =>
        console.error("Error fetching tour guide details:", error)
      );
  }, [guideId, touristId]);

  const handleRatingSubmit = () => {
    if (hasRated || !newRating) return;
    setRatingError("");
    setRatingSuccess(false);
    console.log("Submitting rating:", newRating);
    const ratingData = {
      touristId,
      tourGuideId: guideId,
      rating: newRating,
    };
    console.log("Submitting rating data:", ratingData);
    fetch(`http://localhost:8000/api/tourist/addRating`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ratingData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to submit rating. Please try again.");
        }
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          setRatingError("Error submitting rating. Please try again.");
          console.error("Error in response:", data.error);
        } else {
          setTourGuide((prev) => ({
            ...prev,
            ratings: [...(prev?.ratings || []), data],
          }));
          setNewRating(0);
          setHasRated(true);
          setRatingSuccess(true);
        }
      })
      .catch((error) => {
        setRatingError(error.message);
        console.error("Error submitting rating:", error);
      });
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    setCommentError("");
    setCommentSuccess(false);

    const commentData = {
      touristId,
      tourGuideId: guideId,
      comment: newComment,
    };

    console.log("Submitting comment data:", commentData); // Log the comment data to the console

    fetch(`http://localhost:8000/api/tourist/addComment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(commentData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to submit comment. Please try again.");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Comment response:", data); // Log the response to see what comes back
        if (data.error) {
          setCommentError("Error submitting comment. Please try again.");
          console.error("Error in response:", data.error);
        } else {
          setTourGuide((prev) => ({
            ...prev,
            comments: [...(prev?.comments || []), data],
          }));
          setNewComment("");
          setCommentSuccess(true);
        }
      })
      .catch((error) => {
        setCommentError(error.message);
        console.error("Error submitting comment:", error);
      });
  };

  return tourGuide ? (
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
        {ratingError && (
          <Alert severity="error" sx={{ my: 1 }}>
            {ratingError}
          </Alert>
        )}
        {ratingSuccess && (
          <Alert severity="success" sx={{ my: 1 }}>
            Rating submitted successfully!
          </Alert>
        )}
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
          rows={2}
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
        {commentError && (
          <Alert severity="error" sx={{ my: 1 }}>
            {commentError}
          </Alert>
        )}
        {commentSuccess && (
          <Alert severity="success" sx={{ my: 1 }}>
            Comment submitted successfully!
          </Alert>
        )}
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

export default AddRatingComment;
