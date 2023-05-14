import Header from "./components/Header";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import Cliente from "./views/Cliente";
import Restaurante from "./views/Restaurante";

function App() {
	return (
		<>
			<BrowserRouter>
				<Header />
				<Routes> 
					<Route path="/" element={<Home />} />
					<Route path="/cliente" element={<Cliente />} />
					<Route path="/restaurante" element={<Restaurante />} />
					<Route path="/mesa" element={<p>Mesa</p>} />
					<Route path="/reserva" element={<p>Reserva</p>} />
					<Route path="*" element={<p>Error</p>} /> 
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
