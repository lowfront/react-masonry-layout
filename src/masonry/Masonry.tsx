import { Children, cloneElement, FC, PropsWithChildren, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "./utils";

export type Boxes = {
  [key: string]: {
    height?: number;
    columns?: number;
    left?: number;
    top?: number;
  }
}

const Masonry: FC<PropsWithChildren<{}
>> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [container, setContainer] = useState<HTMLDivElement|null>(null);
  useEffect(() => {setContainer(containerRef.current);}, []);
  
  const [containerWidth, setContainerWidth] = useState(container?.clientWidth ?? innerWidth);
  useEffect(() => {
    const handler = debounce(() => {
      console.log('resize')
      setContainerWidth(container?.clientWidth ?? innerWidth);
    }, 60);
    window.addEventListener('resize', handler);
    handler();
    return () => window.removeEventListener('resize', handler);
  }, [container]);
  

  const [containerHeight, setContainerHeight] = useState(0);

  const columns = useMemo(() => {
    return Math.max(1, Math.round(containerWidth / 300));
  }, [containerWidth]);

  const [boxes, setBoxes] = useState<Boxes>({});
  
  // let boxes: Boxes = {};

  // [init]
  useEffect(() => {
    console.log('container', container, containerRef);
    if (!container) return;
    setBoxHeights();
  // chilren 자식이 변경되면 다시 계산
  // containerWidth가 변경되면 text 높이가 바뀔 수 있으므로 다시 계산
  }, [container, columns, children, containerWidth]);

  const setBoxHeights = () => {
    if (!container) return;
    const boxes: Boxes = {};
    console.log('column', columns);
    let needUpdate = false;
    for (const child of container.children) {
      const childClientHeight = child.clientHeight;
      const { key, preinit, columns } = (child as HTMLElement).dataset as { [key: string]: string; };
      if (!key) throw new Error('There should be a key prop.');
      const targetBox = boxes[key];

      // 초기 계산 끝난 후 변화 없으면 continue
      if (!preinit &&
      targetBox?.height === childClientHeight &&
      targetBox?.columns === +(columns ?? 1)) continue;
      else {
        boxes[key] = {
          height: childClientHeight,
        };
        needUpdate = true;
      }
    }

    needUpdate && setBoxPositions(boxes);
    return needUpdate;
  }

  const setBoxPositions = (boxes: Boxes) => {
    if (!container) return;
    const columnHeights: number[] = Array(columns).fill(0);

    for (const child of container.children) {
      const { key } = (child as HTMLElement).dataset as { [key: string]: string; };

      // 삭제된 박스 제외 코드 추가

      const childColumns = +((child as HTMLElement).dataset.columns ?? 1);
      
      // 삽입 컬럼 인덱스 결정
      const availableColumns = columns - childColumns + 1;
      let minIndex = 0, columnHeight = Infinity;
      for (let i = 0; i < availableColumns; i++) {
        const currentHeight = Math.max(...columnHeights.slice(i, i + childColumns)); // width가 1보다 크면 width범위를 차지하는 높이중 가장 커야 기존 박스와 겹치지 않음
        if (currentHeight < columnHeight) {
          columnHeight = currentHeight;
          minIndex = i;
        }
      }
      
      const newColumnHeight = columnHeight + (boxes[key].height ?? 0);
      boxes[key].left = minIndex / columns;
      boxes[key].top = columnHeight;
      boxes[key].columns = childColumns;
      for (let i = 0; i < childColumns; i++) columnHeights[minIndex + i] = newColumnHeight;
    }

    setBoxes(boxes);
    setContainerHeight(Math.max(...columnHeights));
  };

  const computedChildren = Children.map(children as ReactElement, (el: ReactElement, i) => {
    const key = el.key ?? '';
    const measured = boxes[key];
    return measured
    ? cloneElement(el, {
        "data-key": key,
        key: key,
        style: {
          left: (measured?.left ?? 1) * 100 + '%',
          top: measured.top
        },
        height: measured.height,
        totalColumns: columns,
    })
    : cloneElement(el, {
        "data-key": key,
        "data-preinit": key,
        key: key,
        style: {
          visibility: "hidden"
        },
        height: 0,
        totalColumns: columns,
    });
  });

  return <div ref={containerRef} style={{position: 'relative'}}>
    { computedChildren }
  </div>;
};

export default Masonry;