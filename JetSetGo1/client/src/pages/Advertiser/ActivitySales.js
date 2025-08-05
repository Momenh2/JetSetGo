import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faTags, faChartBar, faComments, faBox, faTasks, faUser } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faTrashAlt,faArchive,faEdit,faSave  } from '@fortawesome/free-solid-svg-icons';
import SalesOverviewChartACT from "../../components/Sales/SalesOverviewChartACT"; //////////////matenashhhhhhhhh//////////////////////////////////////
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
      
    },
    card: {
        minWidth: '200px',
        maxWidth: '250px',
        marginBottom: '20px',
        backgroundColor: '#f4f7fb',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '16px',
        textAlign: 'center',
    },
    cardTitle: {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '8px',
    },
    cardValue: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#1D4ED8',
    }
};

function ActivitySales({usertype}) {
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

  const [Activity, setActivity] = useState([]); // State for Activity
  const [salesData, setSalesData] = useState([]);
  const [groupedSales, setGroupedSales] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState("All"); // Filter by Activity
  const [selectedActivity2, setSelectedActivity2] = useState(""); // Filter by Activity
  const [selectedMonth, setSelectedMonth] = useState("All"); // Filter by month
  const [dateFilter, setDateFilter] = useState("Recent");
  const [statusFilter, setStatusFilter] = useState("All");

  if(usertype =="TourGuide") usertype = "tour-guides";

  if(usertype == "Advertisers") usertype = "advertisers"

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
        const response = await fetch(`/api/advertisers/getAllSales/${id}`,{
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
    // Fetch for the seller
    const fetchActivity = async () => {
      try {
        const response = await fetch(`/api/advertisers/showAll/${id}`, {//////////////
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch Activity");
        }
        const data = await response.json();
        setActivity(data); // Set the list of Activity
      } catch (error) {
        console.error("Error fetching Activities:", error);
      }
    };

    fetchActivity();
  }, [id, usertype]);

useEffect(() => {
    const groupSalesByActivity = () => {
      const grouped = salesData.reduce((acc, sale) => {
        // Extract product details
        const ActivityId = sale.Activity._id;
        const ActivityName = sale.Activity.title;
       // const productPicture = sale.Product.picture; // Add picture field
       // const quantityofProduct=sale.Product.quantityAvailable;
        // If product already exists in the accumulator, update the sales data
        if (acc[ActivityId]) {
          acc[ActivityId].totalRevenue += sale.price;
          acc[ActivityId].totalQuantitySold +=1;
          acc[ActivityId].salesCount += 1;
        } 
        else {
          // If product doesn't exist, create a new entry
          acc[ActivityId] = {
            ActivityId,
            ActivityName,
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
  
    groupSalesByActivity();
  }, [salesData]);

  

  

  if (!salesData) {
    return <div>Loading sales...</div>;
  }
  if(!id){
   console.log("fe eh?")
  }

  const handleActivityFilter = (e) => {
    setSelectedActivity(e.target.value); // Update the selected Activity
  };

  const handleActivityFilter2 = (e) => {
    setSelectedActivity2(e.target.value); // Update the selected Activity
  };
  const handleMonthFilter = (e) => {
    setSelectedMonth(e.target.value); // Update the selected month
  };



  const filteredSales = salesData.filter((sale) => {
    const saleDate = new Date(sale.createdAt);
    const saleMonth = months[saleDate.getMonth()]; // Convert month number to name
    const ActivityFilter = selectedActivity === "All" || sale.Activity._id === selectedActivity;
    const monthFilter = selectedMonth === "All" || saleMonth === selectedMonth;
  
    return ActivityFilter && monthFilter;
  });
  
  // Remove duplicates by Tourist username
  const uniqueTourists = Array.from(new Set(filteredSales.map((sale) => sale.Tourists.username)))
    .map((username) => {
      return filteredSales.find((sale) => sale.Tourists.username === username);
    });
    // Count unique tourists per activity
const uniqueTouristsPerActivity = groupedSales.map((group) => {
    // Filter sales for each activity and get unique tourists
    const uniqueTouristsForActivity = Array.from(new Set(
      filteredSales
        .filter((sale) => sale.Activity._id === group.ActivityId)
        .map((sale) => sale.Tourists.username)
    ));
  
    return {
      ActivityId: group.ActivityId,
      uniqueTouristsCount: uniqueTouristsForActivity.length,
    };
  });
const TableHeadRecent = () => {
    return (
      <thead>
        <tr style={styles.tableHead}>
          <th >Customer</th>
          <th >Activity</th>
          <th>Date</th>
          <th>Price</th>
        </tr>
      </thead>
    );
  };
  
  const TableRowRecent = ({
    key,
    Customer,
    Activity,
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
        <td >{Activity}</td>
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
            value={selectedActivity}
            onChange={handleActivityFilter}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" , marginLeft:"40px",width:"190px"}}
            >
            <option value="All">All Activities</option>
            {Activity.map((Activity) => (
                <option key={Activity.title} value={Activity._id}>
                {Activity.title} 
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
  {uniqueTourists.map((sale, index) => (
    <TableRowRecent
      key={sale._id}
      Customer={sale.Tourists.username}
      Activity={sale.Activity.title}
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
    ActivityName,
    totalQuantitySold,
    totalRevenue,
    salesCount,
    order
  }) => {
    return (
      <tr style={order % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
        <td >
        <img src={IT} alt={Activity.title} style={{ width: "70px", height: "50px", }} />
        {ActivityName}
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
          <th >Activity </th>
          <th >Paid Activities</th>
          <th>Revenue</th>
          <th>Profit</th>
        </tr>
      </thead>
    );
  };

  
  return (
    <div style={styles.bigbox}>
        <div style={styles.container}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
  {uniqueTouristsPerActivity.map((activity) => (
    <Card key={activity.ActivityId} style={styles.card}>
      <CardContent>
        <Typography variant="h6" style={styles.cardTitle}>
          {Activity.find((a) => a._id === activity.ActivityId)?.title || 'Unknown Activity'}
        </Typography>
        <Typography variant="body1" style={styles.cardValue}>
          {activity.uniqueTouristsCount} Tourists
        </Typography>
      </CardContent>
    </Card>
  ))}
</div>
          <h2 className="text-xl font-semibold mb-4" >
            <FiDollarSign /> Activity Data
          </h2>
          
        <TableContainer component={Paper}>
            <table style={styles.table}>
                    <TableHeadfirst />
                    <TableBody style={styles.table}>
                        {groupedSales.map((Sale,index) => (
                            <TableRowfirst 
                            ActivityName={Sale.ActivityName}
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
            value={selectedActivity2}
            onChange={handleActivityFilter2}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" , marginLeft:"40px",width:"190px"}}
            >
                {console.log("mahya shaghala fel guide : ",selectedActivity2 )}
            <option value="None">No selected option</option>
            {Activity.map((Activity) => (
                <option key={Activity.title} value={Activity._id}>
                    {console.log("this is mapping cr7" ,Activity._id )}
                {Activity.title} 
                </option>
            ))}
            </select>
          </div>
          <div style={styles.chartarea}>
            <SalesOverviewChartACT userType="advertisers" ActivityID={selectedActivity2}/>
          </div>
        </div>
    </div>
  );
}

export default ActivitySales;
