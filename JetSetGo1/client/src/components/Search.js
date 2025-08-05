import React, { useEffect, useState } from "react";
import { Grid, InputAdornment, TextField, Typography } from "@mui/material";
import { Autocomplete } from "@mui/material";
import { LocationOn as PinIcon, Search as MagnifierIcon } from "@mui/icons-material";
import clsx from "clsx";
import { search } from "../api"; // Ensure this function fetches city data including `cityCode`

const useStyles = {
  icon: {
    marginRight: 8,
  },
  searchIcon: {
    color: "#757575",
  },
  cityName: {
    fontWeight: 500,
  },
};

const Search = ({ setCityCode }) => {
  const classes = useStyles;
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!inputValue) return;

    const { process, cancel } = search(inputValue); // Assume search returns a process function with cityCode data
    process((newOptions) => {
      setOptions(newOptions || []); 
    });

    return () => cancel();
  }, [inputValue]);

  return (
    <div>
      <Autocomplete
        autoComplete
        autoHighlight
        freeSolo
        disableClearable
        blurOnSelect
        clearOnBlur
        options={options}
        onChange={(event, newValue) => {
          if (newValue && newValue.code) {
            setCityCode(newValue.code); // Set the selected city's code
          }
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        getOptionLabel={(option) => option.city || ""}
        renderOption={(props, option) => (
          <li key={option.code} {...props}>
            <Grid container alignItems="center">
              <Grid item>
                <PinIcon className={clsx(classes.icon)} />
              </Grid>
              <Grid item xs>
                <span className={classes.cityName}>{option.city}</span>
                <Typography variant="body2" color="textSecondary">
                  {option.country || ""}{option.state ? `, ${option.state}` : ""}
                </Typography>
              </Grid>
            </Grid>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search"
            label="City"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <MagnifierIcon className={clsx(classes.searchIcon)} />
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </div>
  );
};

export default Search;
