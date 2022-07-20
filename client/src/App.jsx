import { useState } from "react";
import { EthProvider } from "./contexts/EthContext";
import Home from "./pages/home/Home";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import { Stack } from "@mui/material";

function App() {

  const [open, setOpen] = useState(false);

  return (
    <EthProvider>
      <Stack>
        <ResponsiveAppBar setOpen={setOpen} />
        <Home open={open} setOpen={setOpen} />
      </Stack>
    </EthProvider>
  );
}

export default App;
