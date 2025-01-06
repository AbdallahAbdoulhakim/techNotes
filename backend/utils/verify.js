import mongoose from "mongoose";

export const verifyParams = (
  res,
  params,
  mandatoryParams = [],
  optionalParams = [],
  oneOfManyParams = [],
  oneOfManyOptParams = [],
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
      [
        ...mandatoryParams,
        ...oneOfManyParams,
        ...optionalParams,
        ...oneOfManyOptParams,
      ].includes(curr)
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

  if (
    oneOfManyParams.length &&
    oneOfManyParams.every((val) => !keys.includes(val))
  ) {
    res.status(400);
    throw new Error(
      `Bad request, the request must contains one of the following params: ${oneOfManyParams.join(
        ", "
      )}.`
    );
  }

  if (oneOfManyParams.filter((param) => keys.includes(param)).length > 1) {
    res.status(400);
    throw new Error(
      `Bad request, Only one of the following params: ${oneOfManyParams.join(
        ", "
      )} must be provided.`
    );
  }

  if (oneOfManyOptParams.filter((param) => keys.includes(param)).length > 1) {
    res.status(400);
    throw new Error(
      `Bad request, Only one of the following params: ${oneOfManyOptParams.join(
        ", "
      )} can be provided.`
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

export const verifyMongoId = (res, payload) => {
  const key = Object.keys(payload)[0];
  const value = Object.values(payload)[0];

  if (!mongoose.isObjectIdOrHexString(value)) {
    res.status(400);

    throw new Error(`Bad request, the value of ${key} is not a valid BSON id!`);
  }
};

export const verifyNumericParams = (res, payload) => {
  const key = Object.keys(payload)[0];
  const value = Object.values(payload)[0];

  if (isNaN(value)) {
    res.status(400);

    throw new Error(`Bad request, the value of ${key} must be numeric!`);
  }
};

export const verifyBoolean = (res, payload) => {
  const key = Object.keys(payload)[0];
  const value = Object.values(payload)[0];

  if (typeof value !== "boolean") {
    res.status(400);
    throw new Error(`Bad request, the ${key} parameter must be a boolean`);
  }
};
