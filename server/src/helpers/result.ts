
/**
 * Success Return Object
 * @param data 
 * @returns ({ok, data})
 */
export const Ok = <const Data>(data: Data) => ({ok: true, data} as const)

/**
 * Failure Return Object
 * @param message 
 * @param cause 
 * @returns ({ok, message, cause})
 */
export const NotOk = <
  const Message, 
  const Cause
>(message: Message, cause?: Cause) => ({ok: false, message, cause} as const)