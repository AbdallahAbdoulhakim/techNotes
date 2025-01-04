export const verifyParams = (
  res,
  params,
  mandatoryParams = [],
  optionalParams = [],
  noParamsAllowed = false
) => {
  const keys = Object.keys(params);

  if (!noParamsAllowed && !keys.length) {
    res.status(400);
    throw new Error(`Bad request, no params provided!`);
  }

  const missingParams = mandatoryParams.reduce(
    (prev, curr) => (keys.includes(curr) ? prev : [...prev, curr]),
    []
  );

  if (missingParams.length) {
    res.status(400);
    throw new Error(
      `Bad request, missing mandatory param${
        missingParams.length === 1 ? "" : "s"
      } ${missingParams.join(", ")}.`
    );
  }

  const invalidParams = keys.reduce(
    (prev, curr) =>
      [...mandatoryParams, ...optionalParams].includes(curr)
        ? prev
        : [...prev, curr],
    []
  );

  if (invalidParams.length) {
    res.status(400);
    throw new Error(
      `Bad request, invalid param${
        invalidParams.length === 1 ? "" : "s"
      } ${invalidParams.join(", ")}.`
    );
  }

  return;
};

export const validateArrayEnum = (res, payload, validDict) => {
  if (
    !Array.isArray(Object.values(payload)[0]) ||
    Object.keys(payload).length > 1
  ) {
    res.status(400);
    throw new Error(
      `Bad request, the parameter ${Object.keys(payload)[0]} must be an array!`
    );
  }

  const values = Object.values(payload)[0].map((elt) =>
    String(elt).toLowerCase().trim()
  );
  const validCodes = Object.values(validDict).map((elt) => String(elt).trim());
  const validStr = Object.keys(validDict).map((elt) =>
    elt.toLowerCase().trim()
  );

  const invalidElts = values.reduce(
    (prev, curr) =>
      [...validCodes, ...validStr].includes(String(curr).toLowerCase())
        ? prev
        : [...prev, curr],
    []
  );

  if (invalidElts.length) {
    res.status(400);
    throw new Error(
      `Bad request, invalid value${
        invalidElts.length === 1 ? "" : "s"
      } for the parameter \(${Object.keys(payload)[0]}\) : ${invalidElts.join(
        ", "
      )}.`
    );
  }

  const normalizedElts = values.map((elt) =>
    Object.entries(validDict).reduce(
      (prev, curr) =>
        curr[0].toLowerCase().trim() === elt || String(curr[1]).trim() === elt
          ? curr[1]
          : prev,
      ""
    )
  );

  return [...new Set(normalizedElts)];
};
