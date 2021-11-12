import React from "react";
import "../../styles/navbar/nav.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
	const type = useSelector((state) => state.user.type);
	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
	return (
		<header className="navHeader">
			<nav className="navMain">
				<Link to="/">
					<h2>Pet Rental</h2>
				</Link>
				<ul className="mainOptions">
					{type === "Owner" && (
						<>
							<Link to="/owner/requests">
								<li>
									<i className="fa fa-bell"></i>
								</li>
							</Link>
						</>
					)}
					{isLoggedIn === true && (
						<>
							<Link to="/messenger">
								<li>
									<i className="fa fa-wechat"></i>
								</li>
							</Link>
							<li>
								<i className="fa fa-sign-out"></i>
							</li>
						</>
					)}

					{isLoggedIn === false && (
						<>
							<Link to="/signin">
								<li>
									<i>log in</i>
								</li>
							</Link>
							<Link to="/signup">
								<li>
									<i>sign up</i>
								</li>
							</Link>
						</>
					)}
				</ul>
			</nav>
		</header>
	);
};

export default Navbar;
