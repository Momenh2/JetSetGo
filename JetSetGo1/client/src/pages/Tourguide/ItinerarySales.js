import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faTags, faChartBar, faComments, faBox, faTasks, faUser } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faTrashAlt,faArchive,faEdit,faSave  } from '@fortawesome/free-solid-svg-icons';
import SalesOverviewChartIT from "../../components/Sales/SalesOverviewChartIT"; //////////////matenashhhhhhhhh//////////////////////////////////////
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { FiArrowUpRight, FiDollarSign, FiMoreHorizontal } from "react-icons/fi";
import { Card, CardContent, Typography } from '@mui/material';
import IT from "../../assets/images/ItPic.jpg";

const styles = {
    bigbox:{
        margin:'30px',
    },
    container: {
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #D1D5DB', // Stone-300 equivalent
      backgroundColor: '#FFFFFF',
      marginBottom: '24px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    tableHead: {
      backgroundColor: '#F9FAFB', // Light background
      fontWeight: '600',
      textAlign: 'left',
    },
    tableRowOdd: {
      backgroundColor: '#F3F4F6', // Stone-100 equivalent
    },
    tableRowEven: {
      backgroundColor: '#FFFFFF',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
    },
    headerTitle: {
      fontSize: '16px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    seeAllButton: {
      fontSize: '14px',
      color: '#fffff', // Violet-500 equivalent
      backgroundColor: '#0839b5',
      cursor: 'pointer',
      width:'150px',
      height:'43px'
    },
    chartarea:{
      display:'flex',
      flexDirection:'column',
      justifyContent:'center',
      alignItems:'center',
    },
    filtersparted:{
      display:'flex',
      flexDirection:'row',
      justifyContent:"space-between",
      
    }
  };

function ItinerarySales({usertype}) {
  const location = useLocation();
  
  const token = Cookies.get("auth_token");
  const decodedToken = jwtDecode(token);
  const id = decodedToken.id;
  console.log("id:", id);


  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [Itinerary, setItinerary] = useState([]); // State for Itinerary
  const [salesData, setSalesData] = useState([]);
  const [groupedSales, setGroupedSales] = useState([]);
  const [selectedItinerary, setSelectedItinerary] = useState("All"); // Filter by Itinerary
  const [selectedItinerary2, setSelectedItinerary2] = useState(""); // Filter by Itinerary
  const [selectedMonth, setSelectedMonth] = useState("All"); // Filter by month
  const [dateFilter, setDateFilter] = useState("Recent");
  const [statusFilter, setStatusFilter] = useState("All");

  if(usertype =="TourGuide") usertype = "tour-guides";
  //this calculates the date as a month and year
  const calculateDuration = (createdAt) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    console.log("in date mod")
    const years = now.getFullYear() - createdDate.getFullYear();
    const months = now.getMonth() - createdDate.getMonth() + (years * 12);

    const displayYears = Math.floor(months / 12);
    const displayMonths = months % 12;

    
  };

  
  useEffect(() => {
    const fetchSales = async () => {
        const response = await fetch(`/api/tour-guides/getAllSales/${id}`,{
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        })
        if (!response.ok) {
            throw new Error("Failed to fetch sales");
          }
  
          const data = await response.json(); // Parse the JSON response
          setSalesData(data);
          console.log(data)
    }
    fetchSales();

}, [id]);



useEffect(() => {
    // Fetch products for the seller
    const fetchItinerary = async () => {
      try {
        const response = await fetch(`/api/tour-guides/showAll?guideId=${id}`, {//////////////
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch Itineraries");
        }
        const data = await response.json();
        setItinerary(data); // Set the list of Itinerary
      } catch (error) {
        console.error("Error fetching Itineraries:", error);
      }
    };

    fetchItinerary();
  }, [id, usertype]);


  


useEffect(() => {
    const groupSalesByItinerary = () => {
      const grouped = salesData.reduce((acc, sale) => {
        // Extract product details
        const ItineraryId = sale.Itinerary._id;
        const ItineraryName = sale.Itinerary.title;
       // const productPicture = sale.Product.picture; // Add picture field
       // const quantityofProduct=sale.Product.quantityAvailable;
        // If product already exists in the accumulator, update the sales data
        if (acc[ItineraryId]) {
          acc[ItineraryId].totalRevenue += sale.price;
          acc[ItineraryId].totalQuantitySold +=1;
          acc[ItineraryId].salesCount += 1;
        } 
        else {
          // If product doesn't exist, create a new entry
          acc[ItineraryId] = {
            ItineraryId,
            ItineraryName,
           // productPicture, // Include picture in the grouped data
            //quantityofProduct,
            totalRevenue: sale.price,
            totalQuantitySold: 1,
            salesCount: 1,
          };
        }
  
        return acc;
      }, {});
  
      // Convert grouped data to an array and set it in state
      setGroupedSales(Object.values(grouped));
    };
  
    groupSalesByItinerary();
  }, [salesData]);



  

  if (!salesData) {
    return <div>Loading sales...</div>;
  }
  if(!id){
   console.log("fe eh?")
  }

  

  const handleItineraryFilter = (e) => {
    setSelectedItinerary(e.target.value); // Update the selected Itinerary
  };

  const handleItineraryFilter2 = (e) => {
    setSelectedItinerary2(e.target.value); // Update the selected Itinerary
  };
  const handleMonthFilter = (e) => {
    setSelectedMonth(e.target.value); // Update the selected month
  };



  const filteredSales = salesData.filter((sale) => {
    const saleDate = new Date(sale.createdAt);
    const saleMonth = months[saleDate.getMonth()]; // Convert month number to name
    console.log(selectedItinerary)
    const ItineraryFilter = selectedItinerary === "All" || sale.Itinerary._id === selectedItinerary;
    
    const monthFilter = selectedMonth === "All" || saleMonth === selectedMonth;

    return ItineraryFilter && monthFilter;
  });
  const uniqueTouristsPerItinerary = groupedSales.map((group) => {
    // Filter sales for each itinerary and get unique tourists
    const uniqueTouristsForItinerary = Array.from(new Set(
      filteredSales
        .filter((sale) => sale.Itinerary._id === group.ItineraryId)
        .map((sale) => sale.Tourists.username)
    ));
  
    return {
      ItineraryId: group.ItineraryId,
      uniqueTouristsCount: uniqueTouristsForItinerary.length,
    };
  });
  // Filter tourists to remove duplicates based on username
const uniqueFilteredSales = Array.from(
    new Map(
      filteredSales.map((sale) => [sale.Tourists.username, sale])
    ).values()
  );

const TableHeadRecent = () => {
    return (
      <thead>
        <tr style={styles.tableHead}>
          <th >Customer</th>
          <th >Itinerary</th>
          <th>Date</th>
          <th>Price</th>
        </tr>
      </thead>
    );
  };
  
  const TableRowRecent = ({
    key,
    Customer,
    Itinerary,
    date,
    price,
    order
  }) => {
    return (
      <tr style={order % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
        <td >
          {/* <a
            href="#"
            className="text-violet-600 underline flex items-center gap-1"
          > */}
            {Customer} <FiArrowUpRight />
          {/* </a> */}
        </td>
        <td >{Itinerary}</td>
        <td >{date}</td>
        <td >{price}</td>
        {/* <td className="w-8">
        <button className="hover:bg-stone-200 transition-colors grid place-content-center rounded text-sm size-8">
          <FiMoreHorizontal />
        </button>
        </td> */}
      </tr>
    );
  };


const RecentTransactions = () => {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 className="text-xl font-semibold mb-4" >
            <FiDollarSign /> Recent Transactions
          </h2>
          
        </div>
        <div style={styles.filtersparted}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            <select
            value={selectedItinerary}
            onChange={handleItineraryFilter}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" , marginLeft:"40px",width:"190px"}}
            >
            <option value="All">All Itineraries</option>
            {Itinerary.map((Itinerary) => (
                <option key={Itinerary.title} value={Itinerary._id}>
                {Itinerary.title} 
                </option>
            ))}
            </select>

            <select
            value={selectedMonth}
            onChange={handleMonthFilter}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" , marginLeft:"40px",width:"190px"}}
            >
            <option value="All">All Months</option>
            {months.map((month) => (
                <option key={month} value={month}>
                {month}
                </option>
            ))}
            </select>
            </div>

        </div>
        <table style={styles.table}>
          <TableHeadRecent />
          <tbody>
  {uniqueFilteredSales.map((sale, index) => (
    <TableRowRecent
      key={sale._id}
      Customer={sale.Tourists.username}
      Itinerary={sale.Itinerary.title}
      date={sale.createdAt}
      price={sale.price}
      order={index + 1}
    />
  ))}
</tbody>
        </table>
      </div>
    );
  };

  const TableRowfirst = ({
    ItineraryName,
    totalQuantitySold,
    totalRevenue,
    salesCount,
    order
  }) => {
    return (
      <tr style={order % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
        <td >
        <img src={IT} alt={Itinerary.title} style={{ width: "70px", height: "50px", }} />
        {ItineraryName}
        </td>
        <td >{totalQuantitySold}</td>
        <td >{totalRevenue}$</td>
        <td >{salesCount}$</td>
        {/* <td className="w-8">
        <button className="hover:bg-stone-200 transition-colors grid place-content-center rounded text-sm size-8">
          <FiMoreHorizontal />
        </button>
        </td> */}
      </tr>
    );
  };

  const TableHeadfirst = () => {
    return (
      <thead>
        <tr style={styles.tableHead}>
          <th >Itinerary </th>
          <th >Paid Itineraries</th>
          <th>Revenue</th>
          <th>Profit</th>
        </tr>
      </thead>
    );
  };

  
  return (
    <div style={styles.bigbox}>
        <div style={styles.container}>
          <h2 className="text-xl font-semibold mb-4" >
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
  {uniqueTouristsPerItinerary.map((itinerary) => (
    <Card key={itinerary.ItineraryId} style={styles.card}>
      <CardContent>
        <Typography variant="h6" style={styles.cardTitle}>
          {Itinerary.find((i) => i._id === itinerary.ItineraryId)?.title || 'Unknown Itinerary'}
        </Typography>
        <Typography variant="body1" style={styles.cardValue}>
          {itinerary.uniqueTouristsCount} Tourists
        </Typography>
      </CardContent>
    </Card>
  ))}
</div>

            <FiDollarSign /> Itinerary Data
          </h2>
          
        <TableContainer component={Paper}>
            <table style={styles.table}>
                    <TableHeadfirst />
                    <TableBody style={styles.table}>
                        {groupedSales.map((Sale,index) => (
                            <TableRowfirst 
                            ItineraryName={Sale.ItineraryName}
                            totalQuantitySold={Sale.totalQuantitySold}
                            totalRevenue={Sale.totalRevenue}
                            salesCount={Sale.salesCount}
                            order={index}
                            />
                        ))}
                    </TableBody>
                </table>
                
        </TableContainer>
        </div>
        <div>
        <RecentTransactions/>
        </div>
        <div style={styles.container}>
        <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
        <br></br>
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        <select
            value={selectedItinerary2}
            onChange={handleItineraryFilter2}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" , marginLeft:"40px",width:"190px"}}
            >
            <option value="None">No selected option</option>
            {Itinerary.map((Itinerary) => (
                <option key={Itinerary.title} value={Itinerary._id}>
                {Itinerary.title} 
                </option>
            ))}
            </select>
          </div>
          <div style={styles.chartarea}>
            <SalesOverviewChartIT userType="tour-guides" ItineraryID={selectedItinerary2}/>
          </div>
        </div>
    </div>
  );
}

export default ItinerarySales;
