const HLTagElement = ({ tag }) => {

    return (
        <div className="tag-details">
            <h4>{tag.title}</h4>
            <p><strong>Type: </strong>{tag.type}</p>
            <p><strong>Historical Period: </strong>{tag.historicalPeriod}</p>
        </div>
    );
};

export default HLTagElement;
