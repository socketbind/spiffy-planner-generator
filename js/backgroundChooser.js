import React from "react";
import {
    Button,
    Card,
    Classes,
    ControlGroup,
    Dialog,
    FileInput,
    InputGroup,
    NonIdealState,
    Spinner,
    Tab,
    Tabs
} from "@blueprintjs/core";

class UnsplashImageResult extends React.Component {

    render() {
        return (
            <div className="unsplash-result">
                <a className="unsplash-result" href="#" onClick={(e) => {
                    e.preventDefault();
                    this.props.onImageClicked && this.props.onImageClicked(this.props.item);
                }}>
                    <img src={this.props.item.urls.thumb}/>
                </a><br/>
                Photo by <a href={this.props.item.user.links.html}>{this.props.item.user.name}</a> on <a href={this.props.item.links.html}>Unsplash</a>
            </div>
        );
    }

}

class UnsplashPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {loading: false, query: '', results: null, page: 1, error: false};
    }

    componentDidMount() {
        this.termInput.focus()
    }

    componentWillUnmount() {
        this.fetchControl && this.fetchControl.abort();
    }

    handleSubmission() {
        const query = this.state.query && this.state.query.trim();

        if (query !== "") {
            this.setState({query});

            this.initiateQuery();
        }
    }

    initiateQuery() {
        this.setState({loading: true, error: false});

        const url = `/protected/unsplash/search/photos?page=${this.state.page}&query=${encodeURIComponent(this.state.query)}`;

        this.fetchControl = new AbortController();

        fetch(url, {signal: this.fetchControl.signal})
            .then(r => r.json())
            .then(results => {
                this.setState({loading: false, results});
            })
            .catch(reason => {
                this.setState({loading: false, error: true});
            })
            .finally(() => {
                this.fetchControl = null;
            });
    }

    handleImageClicked(item) {
        const attribution = {
            photoUrl: item.links.html,
            user: {
                name: item.user.name,
                profileUrl: item.user.links.html
            }
        };

        this.props.onImageReady && this.props.onImageReady(item.urls.raw, attribution);

        const downloadUrl = `/protected/unsplash/photos/${item.id}/download`;

        fetch(downloadUrl)
            .catch(err => console.error("Unable to trigger download on Unsplash", err));
    }

    handlePrevClicked() {
        if (this.state.page > 1) {
            this.setState({page: this.state.page - 1}, () => {
                this.initiateQuery();
            });
        }
    }

    handleNextClicked() {
        if (this.state.page < this.state.results.total_pages) {
            this.setState({page: this.state.page + 1}, () => {
                this.initiateQuery();
            });
        }
    }

    render() {
        const controlsDisabled = !this.state.results || this.state.results.total_pages <= 1;
        const prevDisabled = controlsDisabled || this.state.page === 1;
        const nextDisabled = controlsDisabled || this.state.page === this.state.results.total_pages;

        return (<>
            <ControlGroup className="unsplash-query">
                <InputGroup
                    disabled={this.state.loading}
                    fill={true}
                    placeholder="Search terms..."
                    inputRef={el => this.termInput = el}
                    onKeyUp={e => {
                        if (e.key === 'Enter') this.handleSubmission()
                    }}
                    value={this.state.query}
                    onChange={event => this.setState({query: event.target.value})}
                />
                <Button
                    icon="arrow-left"
                    disabled={prevDisabled}
                    onClick={_ => this.handlePrevClicked()}
                />
                <Button
                    icon="arrow-right"
                    disabled={nextDisabled}
                    onClick={_ => this.handleNextClicked()}
                />
            </ControlGroup>
            {(this.state.results &&
                <p>Showing
                    page {this.state.page} of {this.state.results.total_pages} with {this.state.results.total} results</p>)}
            <Card className="unsplash-results">
                {(this.state.results === null && !this.state.loading) && <>Results will be shown here after you
                    enter the search term.</>}

                {this.state.loading && <Spinner intent="primary"/>}

                {(this.state.results && this.state.results.total > 0 && this.state.results.results.map(item =>
                    <UnsplashImageResult
                        key={item.id}
                        item={item}
                        onImageClicked={_ => this.handleImageClicked(item)}
                    />
                ))}

                {!nextDisabled && <Button
                    rightIcon="arrow-right"
                    text="Next page"
                    minimal={true}
                    onClick={_ => this.handleNextClicked()}
                />}

                {this.state.results && this.state.results.total === 0 && <NonIdealState
                    icon="search"
                    title="No search results"
                />}

                {this.state.error && <NonIdealState
                    icon="error"
                    title="Network error"
                    description="Please try again later."
                />}
            </Card>
        </>)
    }
}

class LocalFilePanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {image: null};
    }

    handleChange(input) {
        if (input.files.length > 0) {
            const file = input.files[0];

            if (!file.type.startsWith('image/')) return;

            this.state.image && window.URL.revokeObjectURL(this.state.image);

            this.setState({image: window.URL.createObjectURL(file)})
        }
    }

    useThisImage() {
        this.props.onImageReady && this.props.onImageReady(this.state.image);
    }

    render() {
        return (
            <>
                <FileInput
                    text="Choose file..."
                    fill={true}
                    onInputChange={e => {
                        this.handleChange(e.target)
                    }}
                    inputProps={{accept: "image/*"}}
                />
                <Card interactive={false} className="local-image-file-preview">
                    {this.state.image && <>
                        <img src={this.state.image} style={{'width': '100%'}}/>
                        <Button text="Use this image" intent="primary" onClick={() => this.useThisImage()}/>
                    </>
                    }
                </Card>
            </>
        );
    }
}

export class BackgroundChooser extends React.Component {

    handleImageReady(url, attribution) {
        this.props.onImageReady && this.props.onImageReady(url, attribution)
        this.handleClose()
    }

    render() {
        return (
            <Dialog
                icon="media"
                title="Choose background"
                isOpen={this.props.isOpen}
                onClose={() => this.handleClose()}
                className="background-dialog"
            >
                <div className={Classes.DIALOG_BODY}>
                    <Tabs animate={true} renderActiveTabPanelOnly={true}>
                        <Tab id="unsplash" title="Unsplash"
                             panel={<UnsplashPanel onImageReady={(imageUrl, attribution) => this.handleImageReady(imageUrl, attribution)}/>}/>
                        <Tab id="local" title="Local file"
                             panel={<LocalFilePanel onImageReady={imageUrl => this.handleImageReady(imageUrl, null)}/>}/>
                    </Tabs>
                </div>
            </Dialog>
        )
    }

    handleClose() {
        this.props.onClose && this.props.onClose()
    }
}