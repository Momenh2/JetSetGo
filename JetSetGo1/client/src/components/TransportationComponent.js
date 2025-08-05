const TransportationComponent = ({ transport }) => {

    const handleClick = async () => {

        const response = await fetch('http://localhost:8000/api/advertisers/deleteTransportation/' + transport._id, {
            method: 'DELETE'
        });
        const json = await response.json();
        if (!response.ok) {
        }
        if (response.ok) {
            console.log('Post deleted:', json)
        }
    };

    return (
        <div className="tag-details">
            <h4>{transport.title}</h4>
            <h4>{transport._id}</h4>

            <p><strong>Vehicle Type: </strong>{transport.vehicle}</p>
            {transport.vehicle === 'car' && (
                <>
                    <p><strong>Car Model: </strong>{transport.carModel}</p>
                    <p><strong>Car Location (Region): </strong>{transport.cLocation}</p>
                    <p><strong>Days Available: </strong>{transport.days}</p>
                    <p><strong>Timings Available: </strong>{transport.time}</p>

                </>
            )}

            {transport.vehicle === 'bus' && (
                <>

                    <p><strong>Bus Pickup Location: </strong>{transport.bLocation.pickup}</p>
                    <p><strong>Bus Dropoff Location: </strong>{transport.bLocation.dropoff}</p>
                    <p><strong>Remaining Seats: </strong>{transport.capacity}</p>
                    <p><strong>Departure Day: </strong>{transport.days}</p>
                    <p><strong>Departure Time: </strong>{transport.time}</p>

                </>
            )}

            <p><strong>Price: </strong>{transport.price}</p>
            <p><strong>Advertiser: </strong>{transport.advertiser}</p>
            <p>{transport.createdAt}</p>
            <span onClick={handleClick}>X</span>
        </div>
    );
};

export default TransportationComponent;