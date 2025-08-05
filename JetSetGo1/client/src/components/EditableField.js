import React, { useState, useEffect, useRef } from 'react';

const EditableField = ({ value, onSave, inputType = 'text', options = [] }) => {
  const [editValue, setEditValue] = useState(value);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  // Adjust textarea height automatically based on content
  const adjustHeight = () => {
    if (inputRef.current && inputType === 'text') {
      inputRef.current.style.height = 'auto';  // Reset the height to auto
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;  // Adjust height to content
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleSave = () => {
    if (editValue !== value) {
      onSave(editValue); // Save the new value
    }
    setIsEditing(false); // Exit edit mode
  };

  const handleCancel = () => {
    setEditValue(value); // Reset to original value
    setIsEditing(false); // Exit edit mode
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave(); // Save the edit on Enter key
      e.preventDefault(); // Prevent the default behavior (e.g., submitting a form)
    } else if (e.key === 'Escape') {
      handleCancel(); // Cancel edit on Escape key
    }
  };

  // Focus the input when editing starts and adjust height if it's a textarea
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      adjustHeight(); // Adjust height to fit content
    }
  }, [isEditing]);

  return (
    <div onClick={handleEditClick} style={{ cursor: 'pointer' }}>
      {!isEditing ? (
        <span>{value}</span> // Display value normally
      ) : (
        // If inputType is 'textarea'
        inputType === 'text' ? (
          <textarea
            ref={inputRef}
            value={editValue}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            onBlur={handleSave} // Optional: Save on blur
            style={{ 
              fontSize: 'inherit', 
              border: '1px solid #ccc', 
              padding: '4px', 
              borderRadius: '4px', 
              resize: 'none', 
              overflow: 'hidden', 
              width: '100%' 
            }}
            rows={1} // Default row count to make it more compact initially
          />
        ) : inputType === 'date' ? (
          // If inputType is 'date'
          <input
            ref={inputRef}
            type="date"
            value={editValue}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            onBlur={handleSave} 
            style={{
              fontSize: 'inherit',
              border: '1px solid #ccc',
              padding: '4px',
              borderRadius: '4px',
              width: '100%',
            }}
          />
        ) : inputType === 'select' ? (
          // If inputType is 'select' (for dropdown like 'accessibility')
          <select
            ref={inputRef}
            value={editValue}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            onBlur={handleSave}
            style={{
              fontSize: 'inherit',
              border: '1px solid #ccc',
              padding: '4px',
              borderRadius: '4px',
              width: '100%',
            }}
          >
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          // Default input for text fields (like 'language', 'pickupLocation', etc.)
          <input
            ref={inputRef}
            type={inputType}
            value={editValue}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            onBlur={handleSave}
            style={{
              fontSize: 'inherit',
              border: '1px solid #ccc',
              padding: '4px',
              borderRadius: '4px',
              width: '100%',
            }}
          />
        )
      )}
    </div>
  );
};

export default EditableField;
