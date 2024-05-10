// Import necessary dependencies
import React from "react"
import { StoryObj, Meta } from "@storybook/react"
import { BackButton, BackButtonProps } from "@/components/auth/back-button"

const meta = {
  title: "app/auth/back-button",
  component: BackButton,
  tags: ["autodocs"],
} satisfies Meta<typeof BackButton>

export default meta

type Story = StoryObj<typeof meta>

// Create a story template using the BackButton component
export const Default: Story = {
  args: {
    href: "/",
    label: "Back",
  },
}
