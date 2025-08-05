
const Categoryelement = ({ tag: category, dispatch }) => {

    const handleClick = async () => {

        const response = await fetch('http://localhost:8000/api/admin/delete_category/' + category._id, {
            method: 'DELETE'
        });
        const json = await response.json();
        if (!response.ok) {
        }
        if (response.ok) {
            console.log('new workout added:', json)
        }
    };
    
    return (
        <div className="tag-details">
            <h4>{category.title}</h4>
            <p><strong>Name: </strong>{category.name}</p>
            <p><strong>Description: </strong>{category.description}</p>
            <p>{category.createdAt}</p>
            <span onClick={handleClick}>X</span>
        </div>
    );
};

export default Categoryelement;
