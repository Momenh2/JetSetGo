import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faTags, faChartBar, faComments, faBox, faTasks, faUser } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faTrashAlt,faArchive,faEdit,faSave  } from '@fortawesome/free-solid-svg-icons';
import SalesOverviewChart from "../../components/Admin/SalesOverviewChart";
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import Cookies from "js-cookie"; // Import js-cookie
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { FiArrowUpRight, FiDollarSign, FiMoreHorizontal } from "react-icons/fi";

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

function ProductSales({usertype}) {
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

  const [products, setProducts] = useState([]); // State for product
  const [salesData, setSalesData] = useState([]);
  const [groupedSales, setGroupedSales] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("All"); // Filter by product
  const [selectedProduct2, setSelectedProduct2] = useState(""); // Filter by product
  const [selectedMonth, setSelectedMonth] = useState("All"); // Filter by month
  const [dateFilter, setDateFilter] = useState("Recent");
  const [statusFilter, setStatusFilter] = useState("All");
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
        const response = await fetch(`/api/${usertype}/getAllSales/${id}`,{
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
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/${usertype}/Products/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data); // Set the list of products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [id, usertype]);

useEffect(() => {
    const groupSalesByProduct = () => {
      const grouped = salesData.reduce((acc, sale) => {
        // Extract product details
        const productId = sale.Product._id;
        const productName = sale.Product.name;
        const productPicture = sale.Product.picture; // Add picture field
        const quantityofProduct=sale.Product.quantityAvailable;
        // If product already exists in the accumulator, update the sales data
        if (acc[productId]) {
          acc[productId].totalRevenue += sale.price * sale.quantityPurchased;
          acc[productId].totalQuantitySold += sale.quantityPurchased;
          acc[productId].salesCount += 1;
        } else {
          // If product doesn't exist, create a new entry
          acc[productId] = {
            productId,
            productName,
            productPicture, // Include picture in the grouped data
            quantityofProduct,
            totalRevenue: sale.price * sale.quantityPurchased,
            totalQuantitySold: sale.quantityPurchased,
            salesCount: 1,
          };
        }
  
        return acc;
      }, {});
  
      // Convert grouped data to an array and set it in state
      setGroupedSales(Object.values(grouped));
    };
  
    groupSalesByProduct();
  }, [salesData]);

  

  

  if (!salesData) {
    return <div>Loading sales...</div>;
  }
  if(!id){
   console.log("fe eh?")
  }

  const handleProductFilter = (e) => {
    setSelectedProduct(e.target.value); // Update the selected product
  };

  const handleProductFilter2 = (e) => {
    setSelectedProduct2(e.target.value); // Update the selected product
  };
  const handleMonthFilter = (e) => {
    setSelectedMonth(e.target.value); // Update the selected month
  };



  const filteredSales = salesData.filter((sale) => {
    const saleDate = new Date(sale.createdAt);
    const saleMonth = months[saleDate.getMonth()]; // Convert month number to name
    console.log(selectedProduct)
    const productFilter = selectedProduct === "All" || sale.Product._id === selectedProduct;
    
    const monthFilter = selectedMonth === "All" || saleMonth === selectedMonth;

    return productFilter && monthFilter;
  });

const TableHeadRecent = () => {
    return (
      <thead>
        <tr style={styles.tableHead}>
          <th >Customer</th>
          <th >Product</th>
          <th>Date</th>
          <th>Price</th>
          <th>Quantity</th>
        </tr>
      </thead>
    );
  };
  
  const TableRowRecent = ({
    key,
    Customer,
    Product,
    date,
    price,
    Quantity,
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
        <td >{Product}</td>
        <td >{date}</td>
        <td >{price}</td>
        <td >{Quantity}</td>
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
            value={selectedProduct}
            onChange={handleProductFilter}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" , marginLeft:"40px",width:"190px"}}
            >
            <option value="All">All Products</option>
            {products.map((product) => (
                <option key={product.name} value={product._id}>
                {product.name} 
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
          
          {filteredSales.map((sale, index) => (
            <TableRowRecent
              key={sale._id}
              Customer={sale.Tourists.username}
              Product={sale.Product.name}
              date={sale.createdAt}
              price={sale.price}
              Quantity={sale.quantityPurchased}
              order={index + 1}
            />
          ))}
          </tbody>
        </table>
      </div>
    );
  };

  const TableRowfirst = ({
    productPicture,
    productName,
    availableQuantity,
    totalQuantitySold,
    totalRevenue,
    salesCount,
    order
  }) => {
    return (
      <tr style={order % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
        <td >
        <img src={`http://localhost:8000/${productPicture}`} alt={productName} className="" style={{ width: "70px", height: "50px", }} />
        {productName}
        </td>
        <td >{availableQuantity}</td>
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
          <th >Product </th>
          <th>Available Quantity</th>
          <th >Purchased Quantity</th>
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
            <FiDollarSign /> Products Data
          </h2>
        <TableContainer component={Paper}>
            <table style={styles.table}>
                    <TableHeadfirst />
                    <TableBody style={styles.table}>
                        {groupedSales.map((Sale,index) => (
                            <TableRowfirst 
                            productPicture={Sale.productPicture}
                            productName={Sale.productName}
                            availableQuantity={Sale.quantityofProduct}
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
            value={selectedProduct2}
            onChange={handleProductFilter2}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" , marginLeft:"40px",width:"190px"}}
            >
            <option value="None">No selected option</option>
            {products.map((product) => (
                <option key={product.name} value={product._id}>
                {product.name} 
                </option>
            ))}
            </select>
          </div>
          <div style={styles.chartarea}>
            <SalesOverviewChart userType={usertype} productId={selectedProduct2}/>
          </div>
        </div>
    </div>
  );
}

export default ProductSales;
