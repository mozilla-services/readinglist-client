"use strict";

export function waterfall(tasks, init) {
  if (!tasks.length) {
    return Promise.resolve(init);
  }
  return tasks.reduce(function(prevTask, task) {
    return prevTask.then(task instanceof Promise ? () => task : task);
  }, Promise.resolve(init));
}

export function toIDBObj(struct, booleanFields=[]) {
  if (typeof struct !== "object") {
    return struct;
  }
  return Object.keys(struct).reduce((acc, key) => {
    acc[key] = booleanFields.indexOf(key) !== -1 ? Number(struct[key]) : struct[key];
    return acc;
  }, {});
}

export function fromIDBObj(struct, booleanFields=[]) {
  if (typeof struct !== "object") {
    return struct;
  }
  return Object.keys(struct).reduce((acc, key) => {
    acc[key] = booleanFields.indexOf(key) !== -1 ? Boolean(struct[key]) : struct[key];
    return acc;
  }, {});
}
