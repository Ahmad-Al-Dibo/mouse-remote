

export default function CoordinatesHeader(props) {
  const {coordinates} = props;
  return (
    <div className="card">
      <h2>Coordinates</h2>
      <div className="coords">
          <span>
            X: <strong id="x">{coordinates.x}</strong>
          </span>
          &nbsp;&nbsp;&nbsp;
          <span>
            Y: <strong id="y">{coordinates.y}</strong>
          </span>
      </div>
  </div>
  )
}
