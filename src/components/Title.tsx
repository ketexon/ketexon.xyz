import Head from "next/head"
import * as React from "react"

export type TitleProps = {
	children?: React.ReactNode
}

export default function Title({children}: TitleProps) {
	return <Head><title>{children ? `${children} | Ketexon` : "Ketexon" }</title></Head>
}