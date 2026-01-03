"use client"

import React, { useState } from "react"
import { Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import useMobile from "@/hooks/use-mobile"

interface MenuItemType {
    label: string
    onClick: () => void
    icon?: React.ReactNode
}

interface ActionMenuButtonProps {
    index: number
    items: MenuItemType[]
    buttonLabel?: string
}

export function ActionMenuButton({       index,
                                         items,
                                         buttonLabel = "メニュー",
                                     }: ActionMenuButtonProps) {
    const isMobile = useMobile()
    const [open, setOpen] = useState(false)

    const menuButton = (
        <Button variant="outline" size="default" aria-label={buttonLabel}>
            <div className={"flex gap-1 items-center"}>
                {items[index].label}
                <Layers className="h-5 w-5" />
            </div>
        </Button>
    )

    if (isMobile) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>{menuButton}</DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{buttonLabel}</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-2">
                        {items.map((item, index) => (
                            <Button
                                key={index}
                                variant="ghost"
                                className="justify-start gap-2"
                                onClick={() => {
                                    item.onClick()
                                    setOpen(false)
                                }}
                            >
                                {item.icon}
                                {item.label}
                            </Button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{menuButton}</DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {items.map((item, index) => (
                    <DropdownMenuItem key={index} onClick={item.onClick} className="gap-2">
                        {item.icon}
                        {item.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
