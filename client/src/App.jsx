import { useState } from "react";
import Home from "./pages/home/Home";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import { Stack } from "@mui/material";

function App() {

  const [open, setOpen] = useState(false);

  return (
    <Stack>
      <ResponsiveAppBar setOpen={setOpen} />
      <Home open={open} setOpen={setOpen} />
    </Stack>
  );
}

export default App;
