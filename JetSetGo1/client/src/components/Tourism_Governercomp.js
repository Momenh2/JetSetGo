
const Tourism_Governercomp = ({ tag: Tourism_Governer, dispatch }) => {

   
    // console.log("inside the RD",Tourism_Governer)
    return (
        <div className="tag-details">
            <h4>{Tourism_Governer.title}</h4>
            <p><strong>Name: </strong>{Tourism_Governer.username}</p>
            <p><strong>password: </strong>{Tourism_Governer.password}</p>
            <p><strong>mail: </strong>{Tourism_Governer.email}</p>
            <p>{Tourism_Governer.createdAt}</p>
            
        </div>
    );
};

export default Tourism_Governercomp;
