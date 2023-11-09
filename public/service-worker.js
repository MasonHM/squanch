const installEvent = () => {
  self.addEventListener("install", () => {
    console.log("service worker installed");
    console.log("scope is: ", self.registration.scope);
  });
};
installEvent();

const activateEvent = () => {
  self.addEventListener("activate", () => {
    console.log("service worker activated");
    console.log("scope is: ", self.registration.scope);
    return self.clients.claim();
  });
};
activateEvent();

const pushEvent = () => {
  self.addEventListener("push", (event) => {
    const data = event.data.json();
    sendNotification(data);
  });
};
pushEvent();

const sendNotification = (data) => {
  const title = data.title;
  const body = data.message;
  const icon = "/favicon.ico";
  const notificationOptions = {
    body: body,
    icon: icon,
  };

  self.registration.showNotification(title, notificationOptions);
};

let cachedData = {};
const fetchEvent = () => {
  self.addEventListener("fetch", async (event) => {
    if (event.request.url.endsWith("/api/combined")) {
      event.respondWith(
        fetch(event.request).then(async (res) => {
          const resClone = res.clone();
          if (resClone && resClone.ok) {
            const data = await resClone.json();
            if (Object.keys(cachedData).length !== 0 && JSON.stringify(data) !== JSON.stringify(cachedData)) {
              const updates = findDifferencesBetweenCombinedData(cachedData, data);
              updates.forEach((update) => sendNotification({ title: "BREAKING NEWS", message: update }));
            }
            cachedData = data;
          }
          return res;
        })
      );
    }
  });
};
fetchEvent();

function findDifferencesBetweenCombinedData(oldData, newData) {
  let differences = [];
  if (oldData.liftData) {
    const lifts = Object.keys(oldData.liftData);
    for (let i = 0; i < lifts.length; i++) {
      const lift = lifts[i];
      differences.push(...findDifferencesBetweenLiftData(oldData.liftData[lift], newData.liftData[lift], lift));
    }
    differences.push(...findDifferenceBetweenWeightMap(oldData.weightData, newData.weightData));
  }
  return differences;
}

function findDifferencesBetweenLiftData(oldData, newData, liftName) {
  let differences = [];
  const curr1RMMap = {};
  for (let i = 0; i < oldData.length; i++) {
    const oldDatum = oldData[i];
    curr1RMMap[oldDatum.name] = oldDatum.curr1RM;
  }

  for (let i = 0; i < newData.length; i++) {
    const newDatum = newData[i];
    const old1RM = curr1RMMap[newDatum.name];
    const new1RM = newDatum.curr1RM;
    if (new1RM != old1RM) {
      differences.push(`${newDatum.name} set a new ${liftName} 1RM of ${new1RM}!`);
    }
  }
  return differences;
}

function findDifferenceBetweenWeightMap(oldData, newData) {
  let differences = [];
  const oldDataKeys = Object.keys(oldData);
  const newDataKeys = Object.keys(newData);
  if (oldDataKeys.length != newDataKeys.length) {
    differences.push(`A new challenger appeared...`);
  }
  for (let i = 0; i < oldDataKeys.length; i++) {
    const person = oldDataKeys[i];
    const oldWeight = oldData[person];
    const newWeight = newData[person];
    if (oldWeight != newWeight) {
      const weightDifference = Math.round(((newWeight - oldWeight) * 100) / 100);
      differences.push(
        `${person} now weighs ${newWeight} lb (${weightDifference > 0 ? `+` : ``}${weightDifference} lb)`
      );
    }
  }

  return differences;
}
