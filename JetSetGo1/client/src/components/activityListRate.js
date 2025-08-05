'use client'

import { useMemo } from 'react'

export default function RatingVisualization({ ratings }) {
    const { ratingStats, averageRating } = useMemo(() => {
        const stats = new Array(5).fill(0)
        let sum = 0
        ratings.forEach((rating) => {
            if (rating.star >= 1 && rating.star <= 5) {
                stats[rating.star - 1]++
                sum += rating.star
            }
        })
        const avg = ratings.length > 0 ? (sum / ratings.length).toFixed(1) : "0.0"
        return { ratingStats: stats, averageRating: avg }
    }, [ratings])

    const maxRatings = Math.max(...ratingStats, 1)

    return (
        <>
            <div className="rating-container">
                <div className="header">
                    <div className="average-rating">{averageRating}</div>
                    <div className="ratings-breakdown">
                        {ratingStats.map((count, index) => (
                            <div key={5 - index} className="rating-bar">
                                <span className="star-label">{5 - index}</span>
                                <div className="bar-container">
                                    <div
                                        className="bar"
                                        style={{ width: `${(count / maxRatings) * 100}%` }}
                                    />
                                </div>
                                <span className="count-label">{count}</span>
                            </div>
                        ))}
                        <div className="total-ratings">
                            {ratings.length} {ratings.length === 1 ? 'RATING' : 'TOTAL RATINGS'}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .rating-container {
          background-color: #FFF;
          padding: 1.2rem;
          right: 0;
          border-radius: 1.5rem;
          max-width: 800px;
        //   buttom: 0px;
        //   margin: 0 auto;
          box-shadow: 0 4px 4px rgba(0, 0, 0, 0.3);
          ":hover": {
                boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)", // Shadow increases on hover
                transform: "translateY(-9px)", // Slightly lift the card on hover
              }
        }

        .header {
          display: flex;
          gap: 1rem;
        }

        .average-rating {
          font-size: 2.5rem;
          font-weight: bold;
          color: #212aa;
        }

        .ratings-breakdown {
          flex: 1;
        }

        .rating-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }

        .star-label {
          font-size: 0.875rem;
          color: #27272a;
          width: 1rem;
          text-align: center;
        }

        .bar-container {
              flex: 1;
              height: 0.5rem;
              background-color: #f4f4f5;
              box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1), inset 0 -1px 2px rgba(0, 0, 0, 0.05);
              border-radius: 9999px;
              overflow: hidden;
}
        .bar {
          height: 100%;
          background-color: rgba(251, 146, 60, 0.7); /* Orange */
        }

        .count-label {
  font-size: 0.875rem;
  color: #27272a;
  width: 2rem;
  height: 2rem; /* Add height for proper centering */
  display: flex; /* Use Flexbox */
  align-items: center; /* Center vertically */
  justify-content: center; /* Center horizontally */
  text-align: center; /* Ensure text alignment */
  border-radius: 50%; /* Optional: makes it look circular if width and height are equal */
}

        .total-ratings {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #27272a;
        }
      `}</style>
        </>
    )
}