
const Mydateselement = ({ tag }) => {

    return (
        <div className="tag-details">
            <p><strong>date: </strong>{tag.date}</p>
            <p><strong>time: </strong>{tag.times}</p>
            <p><strong>date.id </strong>{tag._id}</p>
            <p>{tag.createdAt}</p>
        </div>
    );
};

export default Mydateselement;
