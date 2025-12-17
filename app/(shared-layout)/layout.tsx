import Navbar from "@/components/web/navbar";
import { ReactNode } from "react";

export default function SharedLayoutPage({children}:{children:ReactNode}){
    return(
        <div suppressHydrationWarning={true}>
                <Navbar/>
                {children}
        </div>
    )
}   
