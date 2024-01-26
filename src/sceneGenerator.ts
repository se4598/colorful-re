import {Flag} from "./App";
import colormap from "./colormap.json";

interface Target {
    type: string,
    colorspace?: string,
    entities: string[],
}

function convertColorForTargetType(stripe: string, colorspace?: string): any {
    // @ts-ignore
    if(colorspace && colormap[colorspace] && colormap[colorspace][stripe]){
        // @ts-ignore
        return colormap[colorspace][stripe]
    }
    return parseRGB(nameToRGB(stripe));
}

function nameToRGB(name: string) {
    // Create fake div
    let fakeDiv = document.createElement("div");
    fakeDiv.style.color = name;
    document.body.appendChild(fakeDiv);

    // Get color of div
    let cs = window.getComputedStyle(fakeDiv),
        pv = cs.getPropertyValue("color");

    // Remove div after obtaining desired color value
    document.body.removeChild(fakeDiv);
    console.log("nameToRGB:"+name+"->"+pv);
    return pv;
}
function parseRGB(rgb: string){
    const regex = /rgb\((?<r>\d+), (?<g>\d+), (?<b>\d+)\)/;
    const res =regex.exec(rgb);
    // @ts-ignore
    //console.log("parseRGB:"+[res?.groups["r"], res?.groups["g"], res?.groups["b"]].map(v=>parseInt(v)))
    // @ts-ignore
    return [res?.groups["r"], res?.groups["g"], res?.groups["b"]].map(v=>parseInt(v));
}

export function convertFlagToTarget(flag: Flag, target: Target): HaEntity[] {
    const countSource = flag.colors.length;
    const countTarget = target.entities.length;
    if (countSource > countTarget) {
        throw "can't map, too many stripes"
    }
    const factor = Math.floor(countTarget / countSource);
    const targetEntites: HaEntity[] =  [];
    for (const stripe of flag.colors) {
        const targetColor = convertColorForTargetType(stripe, target.colorspace);
        for (let i = 0; i < factor; i++) {
            targetEntites.push({state: true, rgb_color: targetColor})
        }
    }

    return targetEntites;
}

interface HaScene {
    id: string,
    name: string
    icon?: string
    entities: {
        [entityname: string]: HaEntity
    }
}

interface HaEntity {
    state: boolean
    rgb_color?: number[]
    brightness?: number
}

export function generateScene(name: string, flag: Flag, target: Target): HaScene {
    const entities: HaScene["entities"] = {}
    const entitiesRaw = convertFlagToTarget(flag, target)
    const entitiesFilled: HaEntity[] = [];
    const empty = target.entities.length - entitiesRaw.length;
    // naive: toggle off unused entities
    for (let i = 0; i < Math.floor(empty/2.0); i++) {
        entitiesFilled.push({state: false});
    }
    entitiesFilled.push(...entitiesRaw);
    for (let i = 0; i < Math.ceil(empty/2.0); i++) {
        entitiesFilled.push({state: false});
    }
    for (let i = 0; i < entitiesFilled.length; i++) {
        entities[target.entities[i]] = entitiesFilled[i]
    }
    
    return {
        id: "coRe_generated_" + name,
        name: "Lightbar Flag " + name,
        entities: entities,
        icon: "mdi:flag-minus-outline"
    }
}
export default {};