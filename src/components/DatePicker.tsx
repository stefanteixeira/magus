import React from 'react'
import Picker from 'rc-picker'
import dayjs from 'dayjs'
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs'
import enUS from 'rc-picker/lib/locale/en_US'
import { CalendarIcon } from '@heroicons/react/24/outline'

interface DatePickerProps {
  placeholder: string
  value: string
  onChange: (value: string) => void
  allowClear?: boolean
  inputReadOnly?: boolean
  disabled?: boolean
  testId?: string
}

const DatePickerComponent: React.FC<DatePickerProps> = ({
  placeholder,
  value,
  onChange,
  allowClear = true,
  inputReadOnly = false,
  disabled = false,
  testId,
}) => {
  const suffixIcon = <CalendarIcon className="rc-picker-suffix-icon" />
  const sharedProps = {
    generateConfig: dayjsGenerateConfig,
    locale: enUS,
    transitionName: 'slide-up',
    suffixIcon,
  }

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    onChange(date && date.isValid() ? date.format('MMM D, YYYY') : '')
  }

  return (
    <Picker
      {...sharedProps}
      className="w-full"
      allowClear={allowClear}
      placeholder={placeholder}
      value={
        value && dayjs(value, 'MMM D, YYYY').isValid() ? dayjs(value) : null
      }
      format="MMM D, YYYY"
      onChange={handleDateChange}
      disabledDate={(date) => dayjs().isBefore(date)}
      inputReadOnly={inputReadOnly}
      disabled={disabled}
      data-testid={testId}
    />
  )
}

export default DatePickerComponent
