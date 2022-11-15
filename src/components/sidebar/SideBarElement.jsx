import React, {useState} from 'react'
import { Link } from 'react-router-dom'

const SideBarElement = ({ title, icon, subelements }) => {
    const [active,setActive] = useState(false)
    const subelementsArray = subelements.map(subelement => {
        return (<li key={subelement.title}>
            <Link to={subelement.link} >
                {/* <a href="index.html"> */}
                    <i className="bx bx-right-arrow-alt">
                    </i>{subelement.title}
                    {/* </a> */}

            </Link>
        </li>)
    })
    console.log({subelementsArray})
    return (
        <li className={active?"mm-active":""} >
            <a href="#" onClick={()=> { setActive(prev => !prev)}}  className="has-arrow" aria-expanded={active}>
                <div className="parent-icon"><i className={icon}></i>
                </div>
                <div className="menu-title"  >{title}</div>
            </a>


            <ul className={active?"mm-collapse mm-show":"mm-collapse"}>
                {subelementsArray}
            </ul>
        </li>
    )
}

export default SideBarElement