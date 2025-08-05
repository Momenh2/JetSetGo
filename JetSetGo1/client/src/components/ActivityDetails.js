import { useEffect, useState } from 'react';
import "./ActivityDetails.css"
import { FaStar } from 'react-icons/fa';

const ActivityDetails = ({Activity}) => {
    const [tagNames, setTagNames] = useState([]);
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        const fetchTagNames = async () => {
            try {
                const tagIds = Activity.tags;
                const names = [];

                // Loop over each tag ID to fetch its name from the backend
                for (const tagId of tagIds) {
                    const response = await fetch(`/api/tourist/tagName/${tagId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    
                    
                    const data = await response.json();
                    if (response.ok) {
                        names.push(data.tag_name); // Assume the backend returns { tagName: "Tag Name" }
                        console.log(data.tag_name);
                    } else {
                        console.error(data.error);
                    }
                }

                setTagNames(names);
            } catch (error) {
                console.error("Failed to fetch tag names:", error);
            }
        };

        fetchTagNames();
    }, [Activity.tags]);


    useEffect(() => {
        const fetchCategoryName = async () => {
            try {
                // Assuming `Activity.categoryId` contains the category ID
                const response = await fetch(`/api/tourist/categoryName/${Activity.category}`);
                const data = await response.json();

                if (response.ok) {
                    setCategoryName(data.name);
                } else {
                    console.error(data.error);
                }
            } catch (error) {
                console.error("Failed to fetch category name:", error);
            }
        };

        if (Activity.category) { // Ensures Activity.category is not undefined
            fetchCategoryName();
        }
    }, [Activity.category]);
    
    return(
         <div className="product-grid">
            <div key={Activity._id } className="product-card">
            <h4 className="product-title">{Activity.title}</h4>
            {/* <p><strong> Date: </strong>{Activity.date}</p> */}
            {/* <p><strong> Time: </strong>{Activity.time}</p> */}
            {/* <p><strong> Location: </strong>{Activity.location}</p> */}
            <p className="product-price">${Activity.price}</p>
            <p className="product-description">{categoryName}</p>
            <p className="product-description">#{tagNames.join(', #')}</p>
            {/* <p><strong> Advertiser: </strong>{Activity.advertiser}</p> */}
            {/* <p><strong> Booking Open: </strong>{Activity.bookingOpen}</p> */}
            <div className="product-rating">
              <p  className='rating'>{Activity.totalrating}</p>
               <FaStar className="star-icon" />
            </div>
            <p className="product-description"><strong> Special Discounts: </strong>{Activity.specialDiscounts}</p>
            {/* <p><strong>Created At: </strong>{new Date(Activity.createdAt).toLocaleDateString()}</p> */}
            </div>
        </div>
    )
}

export default ActivityDetails