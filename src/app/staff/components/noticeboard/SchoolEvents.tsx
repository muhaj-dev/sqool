import React from 'react'

interface Event {
  text: string
  date: string
  color: string
}

const events: Event[] = [
  { text: 'Lorem ipsum dolor sit amet', date: '30.11.2024', color: '#5272E9' },
  { text: 'Lorem ipsum dolor sit amet', date: '30.11.2024', color: '#24B0C9' },
  { text: 'Lorem ipsum dolor sit amet', date: '30.11.2024', color: '#FD9E30' },
  { text: 'Lorem ipsum dolor sit amet', date: '30.11.2024', color: '#FD3055' },
  { text: 'Lorem ipsum dolor sit amet', date: '30.11.2024', color: '#5AEE72' },
  { text: 'Lorem ipsum dolor sit amet', date: '30.11.2024', color: '#3EF1FD' },
]

interface CheckboxProps {
  color: string
}

const Checkbox: React.FC<CheckboxProps> = ({ color }) => (
  <div className="inline-flex items-center">
    <input
      type="checkbox"
      checked
      readOnly
      className="h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-offset-2"
      style={{ accentColor: color }}
    />
  </div>
)

interface EventListProps {
  title: string
  events: Event[]
}

const EventList: React.FC<EventListProps> = ({ title, events }) => (
  <div className="w-full md:w-[90%] lg:w-2/6 max-w-[700px] px-4">
    <h2 className="text-lg font-bold mb-4">{title}</h2>
    <ul>
      {events.map((event, index) => (
        <li key={index} className="flex items-center mb-2 text-sm">
          <Checkbox color={event.color} />
          <span className="ml-2 flex-grow font-semibold">{event.text}</span>
          <span className="text-[#A7A9AD]">{event.date}</span>
        </li>
      ))}
    </ul>
  </div>
)

const SchoolEvents: React.FC = () => {
  return (
    <div className="max-full bg-white my-8">
      <div className="flex gap-3 lg:gap-10 flex-wrap">
        <EventList title="Upcoming School Events" events={events} />
        <EventList title="Upcoming School Holidays" events={events} />
      </div>
    </div>
  )
}

export default SchoolEvents
