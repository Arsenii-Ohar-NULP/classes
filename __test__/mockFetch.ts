export const mockFetch = () => {
    global.fetch = jest.fn();
}