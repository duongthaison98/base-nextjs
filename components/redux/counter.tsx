"use client"

import { useAppSelector, useAppDispatch } from "@/lib/redux/hooks"
import { increment, decrement, reset, selectCount } from "@/lib/redux/slices/counterSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Minus, RotateCcw } from "lucide-react"

export function Counter() {
  const count = useAppSelector(selectCount)
  const dispatch = useAppDispatch()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Redux Counter</CardTitle>
        <CardDescription>A simple counter using Redux for state management</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        <div className="text-6xl font-bold mb-4">{count}</div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={() => dispatch(decrement())}>
            <Minus className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => dispatch(increment())}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="ghost" onClick={() => dispatch(reset())}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </CardFooter>
    </Card>
  )
}
