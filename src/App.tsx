import React, {useState} from 'react';
import './App.css';

import flags from "./flags.json";
import colors from "./colormap.json"
interface FlagProps {
    type: string
    colors: string[]
}
interface ColorsProp{
    [key: string]: any
}

function getColor(colorname: string){
    const cs: ColorsProp = colors.html;
    if (Array.isArray(cs[colorname])) {
        let [r, g, b] = cs[colorname];
        return `rgb(${r}, ${g}, ${b})`;
    }
    return colorname;
}

function Flag(props: Readonly<{ flag: FlagProps }>) {
    return <div className={"flag flag-vertical"}>
        {props.flag.colors.map( (stripe,) => {
            return <div style={{backgroundColor: getColor(stripe)}}/> // NOSONAR
        })}
    </div>;
}

function App() {
    const [selectedFlag, setSelectedFlag] = useState<keyof typeof flags>("agender")
  return (
    <div className="App">
      <header className="App-header">
        <select value={selectedFlag} onChange={e=> {
            // @ts-ignore
            setSelectedFlag(e.target.value);
        }}>{Object.keys(flags).map(k =>
         <option key={k} value={k}>{k}</option>
        )}</select>
      </header>
        <main>
            <Flag flag={flags[selectedFlag]}/>
        </main>
    </div>
  );
}

export default App;
