/* Marks a block for the arrival animation. The script hides it only when it starts
   below the fold, so the first screen and every no-script reader see it at once. */
export default function Reveal({ as: Tag = "div", stagger = false, className, children, ...rest }) {
  const flag = stagger ? { "data-reveal-group": "" } : { "data-reveal": "" };
  return <Tag className={className} {...flag} {...rest}>{children}</Tag>;
}
