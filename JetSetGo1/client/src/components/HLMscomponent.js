
const Categoryelement = ({ tag1: museum , tag2: historicallocation ,dispatch }) => {
    
    
    
    return (
        <div className="tag-details">
            <h4>{museum.title}</h4>
      <h4>{museum._id}</h4>
      <p><strong>Ticket Prices for Foreigners: </strong>{museum.ticketPrices.foreigner}</p>
      <p><strong>Ticket Prices for Natives: </strong>{museum.ticketPrices.native}</p>
      <p><strong>Ticket Prices for Students: </strong>{museum.ticketPrices.student}</p>
      <p><strong>Name: </strong>{museum.name}</p>
      <p><strong>Description: </strong>{museum.description}</p>
      <p><strong>Location: </strong>{museum.location}</p>
      <p><strong>Opening Hours : </strong>{museum.openingHours}</p>
      <p><strong>Pictures: </strong>{museum.pictures}</p>
      <p><strong>Tags: </strong>{museum.tags}</p>
      <p><strong>Category: </strong>{museum.category}</p>
      <p><strong>Governor: </strong>{museum.governor}</p>

      <p>{museum.createdAt}</p>
      <br />
      <h4>{historicallocation.title}</h4>
      <h4>{historicallocation._id}</h4>
      <p><strong>Ticket Prices for Foreigners: </strong>{historicallocation.ticketPrices.foreigner}</p>
      <p><strong>Ticket Prices for Natives: </strong>{historicallocation.ticketPrices.native}</p>
      <p><strong>Ticket Prices for Students: </strong>{historicallocation.ticketPrices.student}</p>
      <p><strong>Name: </strong>{historicallocation.name}</p>
      <p><strong>Description: </strong>{historicallocation.description}</p>
      <p><strong>Location: </strong>{historicallocation.location}</p>
      <p><strong>Opening Hours : </strong>{historicallocation.openingHours}</p>
      <p><strong>Pictures: </strong>{historicallocation.pictures}</p>
      <p><strong>Tags: </strong>{historicallocation.tags}</p>
      <p><strong>Category: </strong>{historicallocation.category}</p>
      <p><strong>Governor: </strong>{historicallocation.governor}</p>

      <p>{historicallocation.createdAt}</p>
      <br />


        </div>
    );
};

export default Categoryelement;
