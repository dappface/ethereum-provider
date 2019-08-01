import React from 'react'
import styled from 'styled-components'
import { Size } from '../const'

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

export const Row = styled.div`
  display: flex;
  align-items: center;
`

export const PaddingVertical = styled.div`
  padding: 0 ${Size.Margin12}px;
`

export const PaddingHorizontal = styled.div`
  padding: ${Size.Margin12}px 0;
`

export const Padding = styled.div`
  padding: ${Size.Margin12}px;
`

interface IRadioProps {
  checked: boolean
  label: string
  onClick: React.DOMAttributes<HTMLElement>['onClick']
}

export function Radio({ checked, label, onClick }: IRadioProps) {
  return (
    <RadioContainer onClick={onClick}>
      <Row>
        <StyledInput type='radio' checked={checked} readOnly />
        <div>{label}</div>
      </Row>
    </RadioContainer>
  )
}

const RadioContainer = styled.a`
  cursor: pointer;
`

export const Button = styled.button`
  cursor: pointer;
`

const StyledInput = styled.input`
  margin-right: ${Size.Margin8}px;
`
