import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTable, FaMapMarker, FaExpand, FaTrash, FaArrowRight, FaTag } from "react-icons/fa";
import { QRCodeCanvas } from 'qrcode.react';
import { useNavigate } from "react-router-dom";
import { ConeIcon, Trash2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import styled from 'styled-components'; // Assuming styled-components are used for styling
// New Styled Component for the Button
const CornerButton = styled.button`
  position: absolute;
  bottom: 19px;
  right: 20px;
  background-color: ${(props) => (props.done ? "#34D399" : "#777777")}; // Green if 'Attended', Blue otherwise
  color: white;
  border: 2px solid white; // White border for surrounding effect
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 5px white; // Additional white glow-like shadow
  transition: background-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.done ? "#059669" : "#2563EB")}; // Darker on hover
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 0 8px white; // Slightly stronger white glow on hover
  }
`;

// Styled Components
const PageWrapper = styled.div`
  position: relative;
  max-width: 1350px;
  margin: 0 auto;
`;

const TabContainer = styled.div`
  position: absolute;
  left: 0; /* Positioned at the far left */
  top: 50px;
  display: flex;
  flex-direction: column;
`;

const Tab = styled.button`
  padding: 10px;
  margin-bottom: 5px;
  font-size: 14px;
  border: 1px solid #ddd;
  background: ${(props) => (props.active ? '#3D71E9' : '#fff')};
  color: ${(props) => (props.active ? '#fff' : '#111')};
  cursor: pointer;
  border-radius: 14px;
  text-align: left;
  &:hover {
    background: ${(props) => (props.active ? '#355bb2' : '#f5f5f5')};
  }

  /* Apply translation */
  transform: translate(-105px, -130px); /* Translate 40px left and 20px up */
`;

const Container = styled.div`
  margin-left: 70px; /* Offset the cards to accommodate the tab buttons */
  display: flex;
  flex-wrap: wrap;
`;

const Item = styled.div`
  width: 48%;
  margin: 10px;
  background: #fff;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const FullScreenIcon = styled(FaExpand)`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  z-index: 2;
`;

const QRContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const Num = styled.h2`
  font-size: 60px;
  text-align: center;
  color: #111;
  margin-left: 14px;
`;

const Day = styled.p`
  color: #555;
  text-align: center;
  font-size: 25px;
  margin-bottom: 9px;
  margin-left: 17px;
`;

const Border = styled.span`
  padding: 14px 15px;
  background-color: #ddd;
  border-radius: 50%;
  position: absolute;
`;

const ItemRight = styled.div`
  position: relative;
  float: left;
  padding: 79px 50px;
  width: 25%;
  height: 286px;
`;

const UpBorder = styled(Border)`
  top: -11px;
  right: -35px;
  background-color: #f4f4f9;
  z-index: 1;
`;

const DownBorder = styled(Border)`
  bottom: -11px;
  right: -35px;
  background-color: #f4f4f9;
  z-index: 1;
  `;

const ItemLeft = styled.div`
  position: absolute;
  top: 50%;
  left: 64.5%;
  transform: translate(-50%, -50%);
  width: 73%;
  padding: 34px 20px 19px 46px;
  border-left: 3px dotted #999;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Event = styled.p`
  color: #555;
  font-size: 20px;
  margin-bottom: 9px;
  text-align: left;
`;

const Title = styled.h2`
  color: #111;
  font-size: 34px;
  margin-bottom: 12px;
  text-align: left;
  text-decoration: ${(props) => (props.cancelled ? 'line-through' : 'none')};
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  color: #888;
  margin-bottom: 10px;
  font-size: 18px;
  svg {
    margin-right: 10px;
    color: #666;
  }
`;

const Button = styled.button`
  color: #fff;
  padding: 6px 14px;
  margin-top: 12px;
  font-size: 18px;
  border: none;
  cursor: pointer;
  background: ${(props) =>
    props.done
      ? '#777'
      : props.status === 'Tickets'
        ? '#777'
        : props.status === 'Booked'
          ? '#3D71E9'
          : '#DF5454'};
`;

// Modal Styling
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  width: 60%;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: #888;

  &:hover {
    color: #111;
  }
`;

const TabBar = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 10px; /* Adjust to your preference */
  top: 50px; /* Adjust to your preference */
`;

const TabButton = styled.button`
  padding: 10px;
  margin-bottom: 5px;
  font-size: 16px;
  border: 0.2px solid #ddd;
  background: ${(props) => (props.active ? '#3D71E9' : '#fff')};
  color: ${(props) => (props.active ? '#fff' : '#111')};
  cursor: pointer;
  border-radius: 14px;
  text-align: left;
  transform: translate(10px, 45px); /* Moves 30px right and 20px down */

  &:hover {
    background: ${(props) => (props.active ? '#355bb2' : '#f5f5f5')};
  }
`;

const TrashButton = styled.button`
  position: absolute;
  bottom: 10px;
  left: -150px; /* Move the button 160px to the left */
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: #ef4444;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s, transform 0.3s;

  &:hover {
    background-color: #dc2626;
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.5);
  }

  &:active {
    transform: scale(0.95);
  }

  i {
    font-size: 20px;
    transition: transform 0.3s;
  }

  &:hover i {
    animation: shake 0.5s ease-in-out;
  }

  @keyframes shake {
    0%, 100% { transform: rotate(0); }
    20%, 60% { transform: rotate(-12deg); }
    40%, 80% { transform: rotate(12deg); }
  }
`;


const SmallButton = styled(Button)`
  padding: 4px 10px;
  font-size: 14px;
  display: flex;
  align-items: center;

  svg {
    margin-left: 5px;
  }
`;

const cancelBooking = async (bookingId,refid, type, touristId,referenceType) => {
  try {
    // Determine the cancellation URL and body
    const url = type === 'Transportation'
      ? `http://localhost:8000/api/tourist/deleteTransportBooking/${bookingId}`
      : `http://localhost:8000/api/tourist/cancel_booking`;
    const body = type === 'Transportation' ? undefined : JSON.stringify({ booking_id: bookingId });

    // Send the cancellation request
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    const result = await response.json();
    console.log(response);
    console.log(result);
    if (!response.ok) {
      // alert(result.message);
      toast.error(result.message);
      return 0; // Exit if cancellation fails
    }
    console.log("result",result);
    const orderType = referenceType.toLowerCase(); // Convert to lowercase
    // Prepare the wallet transaction details
    const walletTransactionUrl = 'http://localhost:8000/api/tourist/addWalletTransaction';
    const walletBody = JSON.stringify(
      type === 'Transportation'
        ? {
             touristId, // Assuming `result` contains touristId
            orderId: refid,
            amount: result.price || 0, // Refund amount, ensure the API returns this
            type: 'addition',
            orderType,
          }
        : {
             touristId, // Assuming `result` contains touristId
            orderId: refid,
            amount: result.price || 0, // Refund amount, ensure the API returns this
            type: 'addition',
            orderType,
          }
    );
    console.log("walletbody",walletBody);
    console.log("price",result.price);
    // Send the wallet transaction request
    const walletResponse = await fetch(walletTransactionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: walletBody,
    });

    const walletResult = await walletResponse.json();
    // if (!walletResponse.ok) {
    //   // alert(`Cancellation succeeded, but wallet transaction failed: ${walletResult.message}`);
    //   toast.error(`Cancellation succeeded, but wallet transaction failed: ${walletResult.message}`);
    //   return 0;
    // }

    // alert(`Booking canceled and wallet transaction successful: ${walletResult.message}`);
    toast.success(`Booking canceled and wallet transaction successful: ${walletResult.message}`);
    return 1; // Success
  } catch (err) {
    console.error('Error cancelling booking:', err);
    // alert('Error cancelling booking');
    toast.error('Error cancelling booking');
    return 0;
  }
};





// Helper Function to Format Date
const formatDate = (date) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const d = new Date(date);
  return {
    day: d.getDate(),
    month: months[d.getMonth()],
  };
};

// Function to Check if Date is Past
const isPastDate = (date) => {
  const eventDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate < today;
};
const isDeadlineWithin48Hours = (deadline) => {
  const currentTime = new Date();
  const eventDeadline = new Date(deadline);
  const timeDifference = eventDeadline - currentTime;
  return timeDifference <= 48 * 60 * 60 * 1000; // 48 hours in milliseconds
};


// EventCard Component
const EventCard = ({ events: initialEvents }) => {
  const [events, setEvents] = useState(initialEvents); // Local state for events
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('Upcoming'); // Tab state: 'All', 'Past', 'Upcoming'
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const handleOpenModal = (event) => setSelectedEvent(event);
  const handleCloseModal = () => setSelectedEvent(null);
  const navigate = useNavigate();
  const handleDelete = async (eventId,refid, type , touristId, referenceType) => {
    try {
      console.log("Deleting event:", eventId, type);
      var n = await cancelBooking(eventId,refid, type,touristId,referenceType); // Call the API to cancel the booking
      if (n === 0) return;
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId)); // Update the state
    } catch (error) {
      console.error("Error deleting event:", error);
      // alert("Failed to delete the event. Please try again.");
      toast.error("Failed to delete the event. Please try again.");
    }
  };

  // Filter events based on the active tab
  const filteredEvents = events.filter((event) => {
    const pastDate = isPastDate(event.date);

    if (activeTab === 'All') return true;
    if (activeTab === 'Past') return pastDate;
    if (activeTab === 'Upcoming') return !pastDate;

    return true; // Default to show all
  });
  const handleConfirmDelete = async () => {
    if (eventToDelete) {
      try {
        const { id, event } = eventToDelete;
        console.log("Deleting event:", id, event);
        // Call the API to delete (function assumed to exist)
        setEvents((prevEvents) => prevEvents.filter((e) => e.id !== id));
        setEventToDelete(null);
        setShowValidationModal(false);
      } catch (error) {
        console.error("Error deleting event:", error);
        // alert("Error deleting event:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    setEventToDelete(null);
    setShowValidationModal(false);
  };


  return (
    <>
      {/* Tab Bar */}
      <TabBar>
        <TabButton
          active={activeTab === 'All'}
          onClick={() => setActiveTab('All')}
        >
          All Bookings
        </TabButton>
        <TabButton
          active={activeTab === 'Past'}
          onClick={() => setActiveTab('Past')}
        >
          Past Bookings
        </TabButton>
        <TabButton
          active={activeTab === 'Upcoming'}
          onClick={() => setActiveTab('Upcoming')}
        >
          Upcoming
        </TabButton>
      </TabBar>
     
      {/* Event Cards */}
      <Container>
      <ToastContainer />
        {filteredEvents.map((event, index) => {
          const { day, month } = formatDate(event.date);
          const pastDate = isPastDate(event.date);

          return (
            <Item key={index}>
              <FullScreenIcon onClick={() => handleOpenModal(event)} />
              <QRContainer>
                <QRCodeCanvas
                  value={event.id || 'N/A'}
                  size={80}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="Q"
                />
              </QRContainer>

              <ItemRight>
                <Num>{day}</Num>
                <Day>{month}</Day>
                <UpBorder />
                <DownBorder />
              </ItemRight>

              <ItemLeft>
                <Event>{event.event === 'Transportation' ? 'Transportation' : event.referenceType}</Event>
                <Title cancelled={event.status === 'Cancelled'}>{event.referenceType}</Title>
                <Info>
                  <FaTable />
                  <div dangerouslySetInnerHTML={{ __html: event.schedule }} />
                </Info>
                <Info>
                  <FaTag />
                  <div dangerouslySetInnerHTML={{ __html: event.carModel }} />
                  <p>      </p>
                  <FaMapMarker />
                  <div dangerouslySetInnerHTML={{ __html: event.location }} />
                </Info>
                {pastDate ? null : (
                  <TrashButton
                    onClick={() => handleDelete(event.bookingid, event.id,event.event, event.touristid , event.referenceType)}
                    aria-label="Delete"
                  >
                    <i className={"fas fa-trash-alt"}></i>
                  </TrashButton>
                )}
                <Button status={event.status} done={pastDate}>
                  {pastDate ? 'Attended' : event.status}
                </Button>

                {(event.referenceType === "Activity" || event.referenceType === "Itinerary") && pastDate && (
                  <CornerButton onClick={() => {
                    if (event.referenceType === "Activity") {
                      navigate(`/tourist/ViewActivity/${event.id}`);
                    } else {
                      navigate(`/tourist/ViewItineraryEdit/${event.id}`);
                    }

                  }}>
                    <i className="fa-solid fa-arrow-right fa-fade"></i>
                  </CornerButton>
                )}
              </ItemLeft>
            </Item>
          );
        })}
      </Container>

      {/* Modal */}
      {selectedEvent && (
        <ModalOverlay onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
            <QRContainer>
              <QRCodeCanvas
                value={selectedEvent.id || 'N/A'}
                size={100}
                bgColor="#ffffff"
                fgColor="#000000"
                level="Q"
              />
            </QRContainer>
            <ItemRight>
              <Num>{formatDate(selectedEvent.date).day}</Num>
              <Day>{formatDate(selectedEvent.date).month}</Day>
            </ItemRight>
            <ItemLeft>
              <Event>{selectedEvent.event === 'Transportation' ? 'Transportation' : selectedEvent.referenceType}</Event>
              <Title cancelled={selectedEvent.status === 'Cancelled'}>
                {selectedEvent.referenceType}
              </Title>
              <Info>
                <FaTable />
                <div dangerouslySetInnerHTML={{ __html: selectedEvent.schedule }} />
              </Info>
              <Info>
                <FaMapMarker />
                <div dangerouslySetInnerHTML={{ __html: selectedEvent.location }} />
              </Info>
              <Button status={selectedEvent.status} done={isPastDate(selectedEvent.date)}>
                {isPastDate(selectedEvent.date) ? 'DONE' : selectedEvent.status}
              </Button>
            </ItemLeft>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default EventCard;