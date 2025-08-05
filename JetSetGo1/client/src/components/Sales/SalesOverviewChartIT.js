import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const SalesOverviewItinerary = ({ userType, ItineraryID }) => {
  const [salesData, setSalesData] = useState([]);
  const [filteredSalesData, setFilteredSalesData] = useState([]);
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("January"); // Default month
  const [dailySales, setDailySales] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [showDailyChart, setShowDailyChart] = useState(true); // Toggle state

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1); // Days 1 to 30

  // Function to process backend data into daily format
  const formatDataForChart = (data) => {
    return data.map((item) => {
      const date = new Date(item.createdAt);
      const day = date.getDate();
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      const formattedDate = `${day} ${month} ${year}`;

      return {
        day,
        formattedDate,
        month,
        year,
        sales: item.price,
      };
    });
  };

  const monthIndex = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
  };

  // Group sales data by month and calculate revenue
  const calculateMonthlyRevenue = (data) => {
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

    const revenueByMonth = data.reduce((acc, item) => {
      if (!acc[item.month]) {
        acc[item.month] = 0;
      }
      acc[item.month] += item.sales;
      return acc;
    }, {});

    const monthlyRevenueList = months.map((month) => ({
      month, // Use only the month name
      revenue: revenueByMonth[month] || 0, // Default to 0 if no revenue
    }));

    setMonthlyRevenue(monthlyRevenueList);
  };

  // Fetch sales data from the backend
  const fetchSalesData = async () => {
    try {
      const response = await fetch(`/api/${userType}/sales/${ItineraryID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch sales data");
      }
      const backendData = await response.json();
      const transformedData = formatDataForChart(backendData);
      const salesByDay = daysInMonth.map((day) => ({
        day,
        sales: 0,
      }));
      setSalesData(transformedData);
      setFilteredSalesData(transformedData); // Set initial filtered data
      calculateMonthlyRevenue(transformedData); // Calculate monthly revenue
      transformedData.forEach((sale) => {
        const day = new Date(sale.formattedDate).getDate();
        if (salesByDay[day - 1]) {
          salesByDay[day - 1].sales += sale.sales; // Add sales to the day
        }
      });
      setDailySales(salesByDay);
    } catch (error) {
      console.error("Error fetching sales data:", error.message);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setStartMonth("");
    setEndMonth("");
    setFilteredSalesData(salesData);
  };

  useEffect(() => {
    fetchSalesData();
  }, [ItineraryID, userType]);

  useEffect(() => {
    // Filter sales for the selected month and prepare 30-day data
    const filteredSales = salesData.filter((sale) => {
      const saleDate = new Date(sale.formattedDate);
      return saleDate.getMonth() === monthIndex[selectedMonth];
    });

    // Initialize 30 days with 0 sales
    const salesByDay = daysInMonth.map((day) => ({
      day,
      sales: 0,
    }));

    // Populate the sales data for the days with sales
    filteredSales.forEach((sale) => {
      const day = new Date(sale.formattedDate).getDate();
      if (salesByDay[day - 1]) {
        salesByDay[day - 1].sales += sale.sales; // Add sales to the day
      }
    });

    setDailySales(salesByDay);
  }, [selectedMonth, salesData]);

  return (
    <div className="sales-chart-container" style={{ maxWidth: "1300px" }}>
      

      {/* Filters Section */}
      <div
        className="filters"
        style={{
          display:"flex",
          
          flexDirection:"row-reverse",
          justifyContent:"space-between",
          marginBottom: "20px",
          display: "flex",
          
          alignItems: "center",
        }}
      >

      <button
        onClick={() => setShowDailyChart(!showDailyChart)}
        className="toggle-chart-btn text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
        style={{}}
      >
        {showDailyChart ? "Switch to Monthly Chart" : "Switch to Daily Chart"}
      </button>
        
      {showDailyChart && (<div>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" , marginLeft:"20px",width:"190px"}}
          >
            {Object.keys(monthIndex).map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>)}
        
      </div>

      {/* Toggle Button */}

      {/* Conditional Chart Rendering */}
      <ResponsiveContainer width="100%" height={700}>
        {showDailyChart ? (
          <AreaChart data={dailySales} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="day"
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
              label={{ value: "Day", position: "insideBottomRight", offset: -5 }}
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
              label={{ value: "Sales", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
              formatter={(value) => `$${value.toFixed(2)}`}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#1d47c3"
              fill="#1d47c3"
              fillOpacity={0.3}
            />
          </AreaChart>
        ) : (
          <AreaChart
            data={monthlyRevenue}
            margin={{ top: 20, right: 44, left: 44, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="month"
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
              interval={0} // Ensures all months are shown
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
              domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
            />
            <Tooltip
              formatter={(value) =>
                value === 0 ? "$0.00" : `$${value.toLocaleString()}`
              }
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#2E8B57"
              fill="#2E8B57"
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default SalesOverviewItinerary;
