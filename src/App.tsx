import React, {useState} from 'react';
import './App.css';

import flags from "./flags.json";
import colors from "./colormap.json";
import targets from "./targets.json";
import {generateScene} from "./sceneGenerator";
import YAML from 'yaml'
export interface Flag {
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

function Flag(props: Readonly<{ flag: Flag }>) {
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
            <select value={selectedFlag} onChange={e => {
                // @ts-ignore
                setSelectedFlag(e.target.value);
            }}>{Object.keys(flags).map(k =>
                <option key={k} value={k}>{k}</option>
            )}</select>
            <input type={"button"} value={"Scene"} onClick={() => {
                navigator.clipboard.writeText(YAML.stringify([generateScene(selectedFlag, flags[selectedFlag], targets["lightbar (hass)"])], {aliasDuplicateObjects: false}));
            }}/>
            <input type={"button"} value={"All"} onClick={() => {
                // @ts-ignore
                navigator.clipboard.writeText(YAML.stringify(Object.keys(flags).map(f =>generateScene(f, flags[f], targets["lightbar (hass)"])), {aliasDuplicateObjects: false}));
            }}/>
        </header>
        <main>
            <Flag flag={flags[selectedFlag]}/>
        </main>
    </div>
  );
}

export default App;
