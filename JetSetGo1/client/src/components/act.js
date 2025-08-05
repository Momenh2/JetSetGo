
import { useState } from 'react'
const Act = ({ act: historicallocation }) => {


  const Delete = async () => {

    const response = await fetch('http://localhost:8000/api/advertisers/deleteAct/' + historicallocation._id, {
      method: 'DELETE'
    });
    const json = await response.json();
    if (!response.ok) {
    }
    if (response.ok) {
      console.log('historical location deleted:', json)
    }
  };




  console.log("inside the RD", historicallocation)
  return (

    <div className="tag-details">
      <h4>{historicallocation.title}</h4>
      <h4>{historicallocation._id}</h4>
      <p><strong>rating: </strong>{historicallocation.rating}</p>
      <p><strong>_id: </strong>{historicallocation._id}</p>
      <p><strong>title: </strong>{historicallocation.title}</p>
      <p><strong>date: </strong>{historicallocation.date}</p>
      <p><strong>time: </strong>{historicallocation.time}</p>
      <p><strong>Location: </strong>{historicallocation.location}</p>
      <p><strong>price : </strong>{historicallocation.price}</p>
      <p><strong>category: </strong>{historicallocation.category}</p>
      <p><strong>Tags: </strong>{historicallocation.tags}</p>
      <p><strong>advertiser: </strong>{historicallocation.advertiser}</p>
      <p><strong>bookingOpen: </strong>{historicallocation.bookingOpen}</p>
      <p><strong>specialDiscounts: </strong>{historicallocation.specialDiscounts}</p>
      <p>{historicallocation.createdAt}</p>
      <span onClick={Delete} className='koko'>X</span>
      <br />
      {/* <span onClick={Update}>Edit</span> */}

    </div>
  );
};
export default Act;