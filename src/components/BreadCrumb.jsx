import { Breadcrumb } from "antd";
import { useLocation,Link } from "react-router-dom";

const BreadCrumb = () => {
    const location=useLocation();
    const breadCrumbView =() =>{
        const {pathname}=location;
        const pathnames=pathname.split("/").filter((item) => item);
     
    
    return (  
        <div>
            <Breadcrumb>
            {pathnames.length > 0 ? (
                <Breadcrumb.Item>
                <Link style={{marginLeft:"5px"}} to="campgains">Home</Link>
                </Breadcrumb.Item>

            ):(
                <Breadcrumb.Item style={{marginLeft:"5px"}}>
                Home
                </Breadcrumb.Item>
            ) 
         }
         {pathnames.map((name,index)=>{
            const routeTo= `|${pathnames.slice(0,index+1).join("/")}`;
       
            const isLAst=index=== pathnames.length-1;
            return isLAst?(
                <Breadcrumb.Item>
                {name}
                </Breadcrumb.Item>
            ):(
                <Breadcrumb.Item>
               {name}
                </Breadcrumb.Item>

            )
         })}
            </Breadcrumb>
        </div>
    );
        }; 
        return <>{breadCrumbView()}</>
}
 
export default BreadCrumb;