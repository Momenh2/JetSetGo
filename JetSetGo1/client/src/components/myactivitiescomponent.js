
const Myactivitieselement = ({ tag: activity, dispatch }) => {

    
    
    return (
        <div className="tag-details">
            <h4>{activity.title}</h4>
      <h4>{activity._id}</h4>
      <p><strong>Date: </strong>{activity.date}</p>
      <p><strong>Time: </strong>{activity.time}</p>
      <p><strong>Location: </strong>{activity.location}</p>
      <p><strong>Price: </strong>{activity.price}</p>
      <p><strong>Rating: </strong>{activity.rating}</p>
      <p><strong>Category: </strong>{activity.category}</p>
      <p><strong>Tags: </strong>{activity.tags}</p>
      <p><strong>Advertiser: </strong>{activity.advertiser}</p>
      <p><strong>Booking Open: </strong>{activity.bookingOpen}</p>
      <p><strong>Special Discounts: </strong>{activity.specialDiscounts}</p>
      <p>{activity.createdAt}</p>

      
      <br />


        </div>
    );
};

export default Myactivitieselement;
