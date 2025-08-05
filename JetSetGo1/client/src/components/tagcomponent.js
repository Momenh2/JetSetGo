
const TagElement = ({ tag }) => {

    const handleClick = async () => {

        const response = await fetch('http://localhost:8000/api/admin/deletetag/' + tag._id, {
            method: 'DELETE'
        });
        const json = await response.json();
        if (!response.ok) {
        }
        if (response.ok) {
            console.log('new tag added:', json)
        }
    };
    
    return (
        <div className="tag-details">
            <h4>{tag.title}</h4>
            <p><strong>Name: </strong>{tag.tag_name}</p>
            <p><strong>Description: </strong>{tag.description}</p>
            <p>{tag.createdAt}</p>
            <span onClick={handleClick}>X</span>
        </div>
    );
};

export default TagElement;
