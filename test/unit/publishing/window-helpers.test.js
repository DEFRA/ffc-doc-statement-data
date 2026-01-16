const { isWithinWindow, isPollDay } = require('../../../app/publishing/window-helpers')

describe('window-helpers', () => {
  afterEach(() => {
    jest.useRealTimers()
  })

  describe('isWithinWindow', () => {
    test('returns true when no window provided', () => {
      expect(isWithinWindow(undefined)).toBe(true)
    })

    test('returns true when now is inside the window', () => {
      jest.useFakeTimers('modern')
      jest.setSystemTime(new Date(2020, 0, 1, 10, 30))
      const win = { start: '10:00', end: '11:00' }
      expect(isWithinWindow(win)).toBe(true)
    })

    test('returns false when now is before window start', () => {
      jest.useFakeTimers('modern')
      jest.setSystemTime(new Date(2020, 0, 1, 9, 0))
      const win = { start: '10:00', end: '11:00' }
      expect(isWithinWindow(win)).toBe(false)
    })

    test('returns false when now is after window end', () => {
      jest.useFakeTimers('modern')
      jest.setSystemTime(new Date(2020, 0, 1, 12, 0))
      const win = { start: '10:00', end: '11:00' }
      expect(isWithinWindow(win)).toBe(false)
    })
  })

  describe('isPollDay', () => {
    test('returns true when no pollDays provided', () => {
      expect(isPollDay(undefined)).toBe(true)
    })

    // using 1 Jan 2020 for tests - which is a Wednesday
    test('returns true when today is in pollDays', () => {
      jest.useFakeTimers('modern')
      jest.setSystemTime(new Date(2020, 0, 1))
      expect(isPollDay(['Wed', 'Mon'])).toBe(true)
    })

    test('returns false when today is not in pollDays', () => {
      jest.useFakeTimers('modern')
      jest.setSystemTime(new Date(2020, 0, 1))
      expect(isPollDay(['Mon', 'Tue'])).toBe(false)
    })
  })
})
