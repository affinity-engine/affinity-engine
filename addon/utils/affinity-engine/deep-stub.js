export default function deepStub(path, object) {
  return path.split('.').reverse().reduce((child, segment) => {
    const parent = { };

    parent[segment] = child;

    return parent;
  }, object);
}
