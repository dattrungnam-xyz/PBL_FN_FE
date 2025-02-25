import classes from "./DotLoadingProgress.module.scss";

const DotLoadingProgress: React.FC = () => {
  return (
    <section className={classes.dotsContainer}>
      <div className={classes.dot}></div>
      <div className={classes.dot}></div>
      <div className={classes.dot}></div>
      <div className={classes.dot}></div>
      <div className={classes.dot}></div>
    </section>
  );
};

export default DotLoadingProgress;
