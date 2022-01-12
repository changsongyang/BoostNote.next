import React, { useMemo, useState } from 'react'
import FormInput from '../../../../design/components/molecules/Form/atoms/FormInput'
import FormSelect from '../../../../design/components/molecules/Form/atoms/FormSelect'
import FormRowItem from '../../../../design/components/molecules/Form/templates/FormRowItem'

const CONFIG_TYPES = [
  { label: 'Event', value: 'event' },
  { label: 'Env', value: 'env' },
  { label: 'Custom', value: 'custom' },
]

interface ActionConfigurationInputProps {
  onChange: (value: any) => void
  value: any
  customInput: (
    onChange: ActionConfigurationInputProps['onChange'],
    value: any
  ) => React.ReactNode
  eventDataOptions: string[]
}
const ActionConfigurationInput = ({
  value,
  eventDataOptions,
  onChange,
  customInput,
}: ActionConfigurationInputProps) => {
  const [type, setType] = useState(() => {
    if (typeof value === 'string') {
      if (value.startsWith('$event')) {
        return CONFIG_TYPES[0]
      }
      if (value.startsWith('$env')) {
        return CONFIG_TYPES[1]
      }
    }
    return CONFIG_TYPES[2]
  })

  const options = useMemo(() => {
    return eventDataOptions.map((key) => ({ label: key, value: key }))
  }, [eventDataOptions])

  const normalized = useMemo(() => {
    if (typeof value === 'string') {
      if (value.startsWith('$event')) {
        return value.substr('$event.'.length)
      }

      if (value.startsWith('$env')) {
        return value.substr('$env.'.length)
      }
    }

    return typeof value === 'string' || typeof value === 'number'
      ? value.toString()
      : ''
  }, [value])

  return (
    <>
      <FormRowItem>
        <FormSelect options={CONFIG_TYPES} value={type} onChange={setType} />
      </FormRowItem>
      <FormRowItem>
        {type.value === 'env' && (
          <FormInput
            value={normalized}
            onChange={(ev) => onChange(`$env.${ev.target.value}`)}
          />
        )}
        {type.value === 'event' && (
          <FormSelect
            value={{ label: normalized, value: normalized }}
            options={options}
            onChange={({ value }) => onChange(`$event.${value}`)}
          />
        )}
        {type.value === 'custom' && customInput(onChange, value)}
      </FormRowItem>
    </>
  )
}

export default ActionConfigurationInput