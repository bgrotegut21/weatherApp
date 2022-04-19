const emit = () => {
  let events = {};

  const subscribe = (label, array) => {
    if (!Array.isArray(array)) return new Error('array must have an array');

    if (events[label]) {
      array.forEach((event) => {
        events.push(event);
      });
    } else {
      events[label] = array;
    }
    return events[label];
  };

  const fire = (label, data) => {
    if (events[label]) {
      events[label].forEach((event) => {
        event(data);
      });
    }
  };

  const unsubscribe = (label) => {
    const newEvents = events;
    const finalEvents = {};
    let newEventKeys = Object.keys(newEvents);
    newEventKeys = newEventKeys.filter((key) => key !== label);

    newEventKeys.forEach((key) => {
      finalEvents[key] = newEventKeys[key];
    });

    events = finalEvents;
    return events;
  };

  const unsubscribeAll = () => {
    events = {};
    return events;
  };

  return { subscribe, fire, unsubscribe, unsubscribeAll };
};

export default emit();
