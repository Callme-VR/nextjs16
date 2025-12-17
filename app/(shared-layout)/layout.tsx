import Navbar from "@/components/web/navbar";
import { ReactNode } from "react";

export default function SharedLayoutPage({chiddren}:{chiddren:ReactNode}){
    return(
        <><Navbar/>
        {chiddren}
        </>
    )
}
