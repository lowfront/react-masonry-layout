import { CSSProperties, FC, PropsWithChildren } from "react";

const MasonryBox: FC<PropsWithChildren<{ 
  columns?: number;
  width?: number;
  padding?: number;
  style?: CSSProperties; }>> = ({
    columns = 1,
    width = 1,
    children,
    padding = 10,
    style,
    ...props
  }) => {
  // console.log(`${columns / (totalColumns ?? 1) * 100}%`);
  // console.log('style', {
  //   ...style, 
  //   position: 'absolute',
  //   width: `${columns / (totalColumns ?? 1) * 100}%`
  // });
  return <div 
    data-columns={columns}
    {...props}
    style={{
      ...style,
      position: 'absolute',
      boxSizing: 'border-box',
      padding,
      width: `${width * 100}%`,
      transition: 'left .3s, top .3s'
    }}
    >
    {children}
  </div>
};

export default MasonryBox;